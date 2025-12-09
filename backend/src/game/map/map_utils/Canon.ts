import * as babylon from "@babylonjs/core";
import { WebSocket } from "ws";
import { BALL_DIAMETER, CANON_ANGULAR_VELOCITY_Y, CANON_CHANGE_STUN_INTERVAL, CANON_LINEAR_VELOCITY_X, MAP_SIZE, WALL_WIDTH, CANON_DIMENSION } from "../../settings/values.js";
import { Status, ObjectSpawnerMessage, ObjectSpawner } from "../../web_sockets/types_transfert.js";

class Canon {
	private readonly canon: babylon.Mesh;
	private readonly body: babylon.PhysicsBody;
	private readonly canonSceneObservable: babylon.Observable<babylon.Scene>;
	private readonly canonSceneObserver: babylon.Observer<babylon.Scene>;
	private readonly id: number;
	private readonly sockets: WebSocket[];
	private currentLifetime = 1;
	private currentLinearVelocity: babylon.Vector3 = new babylon.Vector3(CANON_LINEAR_VELOCITY_X, 0, 0);
	private currentAngularVelocity: babylon.Vector3 = new babylon.Vector3(0, CANON_ANGULAR_VELOCITY_Y, 0);
	private readonly position: 1 | -1;
	private changeStunTimer = 0;

	constructor(scene: babylon.Scene, id: number, sockets: WebSocket[], position: "right" | "left") {
		this.canon = babylon.MeshBuilder.CreateBox("canon", { width: CANON_DIMENSION.x, height: CANON_DIMENSION.y, depth: CANON_DIMENSION.z }, scene);
		this.canon.metadata = { type: "collider", stun: Math.random() < 0.5 ? "spin" : "normal" };
		this.position = position === "right" ? 1 : -1;
		const randomPosX = MAP_SIZE.x / 4 * Math.random() * (Math.random() < 0.5 ? 1 : -1);
		const posY = CANON_DIMENSION.y / 2;
		const posZ = (MAP_SIZE.z / 2 - WALL_WIDTH - CANON_DIMENSION.z / 2) * this.position;
		this.canon.position = new babylon.Vector3(randomPosX, posY, posZ);
		this.id = id;
		this.sockets = sockets;
		this.body = this.setCanonPhysic(scene);
		this.canonSceneObservable = scene.onBeforeRenderObservable;
		this.canonSceneObserver = this.canonObserveScene(scene);
	}

	getCanonTip(): babylon.Vector3 | null {
		if (!this.canon.rotationQuaternion)
			return null;
		const localForward = new babylon.Vector3(0, 0, -this.position);

		const worldForward = localForward.rotateByQuaternionToRef(
			this.canon.rotationQuaternion,
			new babylon.Vector3()
		).normalize();

		const tip = this.canon.position.add(
			worldForward.scale(CANON_DIMENSION.z / 2 + BALL_DIAMETER)
		);

		return tip;
	}

	private changeStun(): void {
		if (this.canon.metadata.stun === "spin")
			this.canon.metadata.stun = "normal";
		else
			this.canon.metadata.stun = "spin";
	}

	getStun(): "spin" | "normal" {
		return this.canon.metadata.stun;
	}

	getPosition(): babylon.Vector3 {
		return this.canon.position;
	}

	private canonObserveScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		const canonSceneObserver = this.canonSceneObservable.add(() => {
			if (!this.canon.rotationQuaternion)
				return;

			this.changeStunTimer += scene.metadata.gameSpeed;
			if (this.changeStunTimer >= CANON_CHANGE_STUN_INTERVAL) {
				this.changeStunTimer -= CANON_CHANGE_STUN_INTERVAL;
				this.changeStun();
			}
			const euler = this.canon.rotationQuaternion.toEulerAngles();
			const angleY = babylon.Tools.ToDegrees(euler.y);
			
			if (angleY > 60 || angleY < -60)
				this.currentAngularVelocity = this.currentAngularVelocity.scale(-1);
			if (this.canon.position.x >= MAP_SIZE.x / 4
			|| this.canon.position.x <= -MAP_SIZE.x / 4)
				this.currentLinearVelocity = this.currentLinearVelocity.scale(-1);
				
			this.body.setAngularVelocity(this.currentAngularVelocity);
			this.body.setLinearVelocity(this.currentLinearVelocity);
			this.sendObjectInfos();
		});
		return canonSceneObserver;
	}

	private setCanonPhysic(scene: babylon.Scene): babylon.PhysicsBody {
		const newBody = new babylon.PhysicsBody(this.canon, babylon.PhysicsMotionType.ANIMATED, false, scene);
		newBody.setMassProperties({
			mass: 1,
			centerOfMass: new babylon.Vector3(0, 0, CANON_DIMENSION.z / 2 * this.position)
		});

		const shape = new babylon.PhysicsShapeBox(babylon.Vector3.Zero(), new babylon.Quaternion(0, 0, 0, 1), CANON_DIMENSION, scene);
		shape.material = { restitution: 1, friction: 0 };
		newBody.shape = shape;
		return newBody;
	}

	sendObjectInfos(): void {
		this.sockets.forEach(socket => {
			if (!this.canon.rotationQuaternion)
				return;
			const infos: ObjectSpawnerMessage = {
				status: Status.OBJECTSPAWNER,
				type: ObjectSpawner.CANON,
				id: this.id,
				position: {
					x: this.canon.position.x,
					y: this.canon.position.y,
					z: this.canon.position.z
				},
				rotation: {
					x: this.canon.rotationQuaternion.x,
					y: this.canon.rotationQuaternion.y,
					z: this.canon.rotationQuaternion.z,
					w : this.canon.rotationQuaternion.w
				},
				currentLifetime: this.currentLifetime,
				stun: this.canon.metadata.stun
			};

			socket.send(JSON.stringify(infos));
		});
	}

	destroy(): void {
		this.canonSceneObservable.remove(this.canonSceneObserver);
		this.currentLifetime = 0;
		this.sendObjectInfos();
		this.body?.dispose();
		this.canon?.dispose();
	}
}

export { Canon };
