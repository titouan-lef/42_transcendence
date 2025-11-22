import * as babylon from "@babylonjs/core";
import { MAP_SIZE, TORNADO_ATTRACTION_STRENGTH, TORNADO_COLLISION_RADIUS, TORNADO_LIFETIME, WALL_WIDTH } from "../../settings/values.js";
import { Object, ObjectMessage, Status } from "../../web_sockets/types_transfert.js";
import { WebSocket } from "ws";

class Tornado {
	private tornado: babylon.Mesh;
	private readonly id: number;
	private readonly sockets: WebSocket[];
	private readonly randomSize;
	private readonly tornadoObservable: babylon.Observable<babylon.Scene>;
	private readonly tornadoObserver: babylon.Observer<babylon.Scene>;
	private currentLifetime = 1;

	constructor(scene: babylon.Scene, id: number, windforce: babylon.Vector3, sockets: WebSocket[]) {
		this.id = id;
		this.sockets = sockets;
		const possiblePositionX = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.x - WALL_WIDTH) / 2);
		const possiblePositionZ = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.z - WALL_WIDTH) / 2);
		const position = new babylon.Vector3(possiblePositionX, 0, possiblePositionZ);
		this.tornado = babylon.MeshBuilder.CreateBox("tornado", { width: 0.01, height: 0.01, depth: 0.01 }, scene);
		this.tornado.metadata = { windAffected: true };
		this.tornado.visibility = 0;
		this.tornado.position = position;
		this.randomSize = Math.random() * 4 + 3;

		this.tornadoObservable = scene.onBeforeRenderObservable;;
		this.tornadoObserver = this.setTornadoObserver(scene, windforce);
	}

	getCurrentLifetime(): number {
		return this.currentLifetime;
	}

	private setTornadoObserver(scene: babylon.Scene, windforce: babylon.Vector3): babylon.Observer<babylon.Scene> {
		const tornadoObserver = this.tornadoObservable.add(() => {
			this.tornado.position = this.tornado.absolutePosition.addInPlace(windforce.scale(0.05));
			scene.meshes.forEach(mesh => {
				if (!mesh.metadata?.pushable || !mesh.physicsBody)
					return;
				const body = mesh.physicsBody;
				const meshPosition = mesh.getAbsolutePosition();
				const direction = meshPosition.subtract(this.tornado.absolutePosition);
				direction.y = 0;
				const distance = direction.length();
				const tornadoRadius = TORNADO_COLLISION_RADIUS * this.randomSize;
				if (distance < tornadoRadius && distance > 0) {
					const tangent = new babylon.Vector3(-direction.z, 0, direction.x).normalize();
					const distanceFromCenter = 1 - (distance / tornadoRadius);
					const turningForce = tangent.scale(TORNADO_ATTRACTION_STRENGTH * distanceFromCenter);
					const attractiveForce = direction.scale(-TORNADO_ATTRACTION_STRENGTH * distanceFromCenter);
					const totalForce = turningForce.add(attractiveForce);
					body.applyForce(totalForce, meshPosition);
				}
			});
			this.currentLifetime += scene.getEngine().getDeltaTime() / TORNADO_LIFETIME;
			if (this.currentLifetime <= 0) {
				this.destroy();
				return;
			}
			this.sendObjectInfos(); /** @todo send at 30 fps */
		});
		return tornadoObserver;
	}

	sendObjectInfos(): void {
		this.sockets.forEach(socket => {
			const infos: ObjectMessage = {
				status: Status.OBJECT,
				type: Object.TORNADO,
				id: this.id,
				position: {
					x: this.tornado.position.x,
					y: this.tornado.position.y,
					z: this.tornado.position.z
				},
				size: this.randomSize,
				currentLifetime: this.currentLifetime
			};

			socket.send(JSON.stringify(infos));
		});
	}

	destroy(): void {
		this.tornadoObservable.remove(this.tornadoObserver);
		this.tornado?.dispose();
		this.currentLifetime = 0;
	}
}

export { Tornado };