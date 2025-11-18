import * as babylon from "@babylonjs/core";
import { MAP_SIZE, WALL_WIDTH, METEOR_SPEED, METEOR_DIAMETER, METEOR_COLLISION_RADIUS, METEOR_COLLISION_STRENGTH, METEOR_LIFETIME, BALL_DIAMETER } from "../../settings/values.js";
import { BallTemplate } from "../../ball/BallTemplate.js";
import { Object, ObjectMessage, Status } from "../../../web_sockets/types_transfert.js";
import { WebSocket } from "ws";
export class Meteor {
	private readonly id: number;
	private readonly sockets: WebSocket[];
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly meteor: babylon.Mesh;
	private readonly direction: babylon.Vector3;
	private body: babylon.PhysicsBody | null;
	private readonly randomSize;
	private currentLifetime = 1;

	constructor(scene: babylon.Scene, id: number, sockets: WebSocket[]) {
		this.id = id;
		this.sockets = sockets;
		this.randomSize = Math.random() * 5 + 1;
		const positionXStart = ((Math.random() - 0.5) * 2) * MAP_SIZE.x;
		const positionZStart = ((Math.random() - 0.5) * 2) * MAP_SIZE.z;
		const positionXEnd = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.x - WALL_WIDTH - (BALL_DIAMETER * this.randomSize)) / 2);
		const positionZEnd = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.z - WALL_WIDTH - (BALL_DIAMETER * this.randomSize)) / 2);
		const start = new babylon.Vector3(positionXStart, MAP_SIZE.y, positionZStart);
		const end = new babylon.Vector3(positionXEnd, 0, positionZEnd);
		this.direction = end.subtract(start).normalize();

		this.meteor = this.spawnMeteor(scene, start);
		this.body = null;
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene, end);
	}

	private spawnMeteor(scene: babylon.Scene, position: babylon.Vector3): babylon.Mesh {
		const meteor = babylon.MeshBuilder.CreatePolyhedron("meteor", { type: 2, size: METEOR_DIAMETER * this.randomSize }, scene);
		meteor.position = position;
		meteor.metadata = { type: "collider" };
		return meteor;
	}

	sendObjectInfos(): void {
		this.sockets.forEach(socket => {
			const infos: ObjectMessage = {
				status: Status.OBJECT,
				type: Object.METEOR,
				id: this.id,
				position: {
					x: this.meteor.position.x,
					y: this.meteor.position.y,
					z: this.meteor.position.z
				},
				size: this.randomSize,
				currentLifetime: this.currentLifetime
			};

			socket.send(JSON.stringify(infos));
		});
	}

	private observeScene(scene: babylon.Scene, end: babylon.Vector3): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			if (this.meteor.position.y < 0) {
				if (this.currentLifetime === 1)
					this.applyExplosionForce(scene, end);
				this.currentLifetime -= scene.getEngine().getDeltaTime() / METEOR_LIFETIME;
				this.setBody(scene);
				if (this.currentLifetime <= 0) {
					this?.destroy();
					return ;
				}
			} else {
				const ratio = scene.getAnimationRatio() / 60; //if game is slowed, meteor will also be
				const velocity = this.direction.scale(METEOR_SPEED * ratio);
				this.meteor.position.addInPlace(velocity);
			}
			this.sendObjectInfos(); /** @todo send at 30 fps */
		});
		return sceneObserver;
	} 

	private setBody(scene:babylon.Scene): void {
		const body = new babylon.PhysicsBody(this.meteor, babylon.PhysicsMotionType.STATIC, false, scene);
		body.setMassProperties({
			mass: 0,
			centerOfMass: babylon.Vector3.Zero()
		});
		body.shape = new babylon.PhysicsShapeMesh(this.meteor, scene);
		body.shape.material = { restitution: 1, friction: 0 };
		this.body = body;
	}

	private applyExplosionForce(scene: babylon.Scene, center: babylon.Vector3): void {
		scene.meshes.forEach(mesh => {
			if (!mesh.metadata?.pushable || !mesh.physicsBody)
				return ;
			const body = mesh.physicsBody;
			const meshPosition = mesh.getAbsolutePosition();
			const direction = meshPosition.subtract(center);
			const distance = direction.length();
			const explosionRadius = METEOR_COLLISION_RADIUS * this.randomSize * 2;

			if (distance < explosionRadius && distance > 0) {
				direction.normalize();
				const force = direction.scale(METEOR_COLLISION_STRENGTH * (1 - distance / explosionRadius) * this.randomSize);
				force.y = 0;
				if (mesh instanceof BallTemplate)
					mesh.setJustCollide();
				body.applyImpulse(force, meshPosition);
			}
		});
	}

	getCurrentLifetime(): number {
		return this.currentLifetime;
	}

	destroy(): void {
		this.sceneObservable?.remove(this.sceneObserver);
		this.body?.dispose();
		this.meteor?.dispose();
		this.currentLifetime = 0;
		this.sendObjectInfos();
	}
}