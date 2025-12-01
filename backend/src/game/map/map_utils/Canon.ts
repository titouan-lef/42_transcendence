import * as babylon from "@babylonjs/core";
import { BallTemplate } from "../../ball/BallTemplate.js";
import { WebSocket } from "ws";
import { GameSettings } from "../../settings/GameSettings.js";
import { BALL_DIAMETER, COLORS3, MAP_SIZE, WALL_WIDTH } from "../../settings/values.js";
import { ObjectMessage, Status, Object, ObjectSpawnerMessage, ObjectSpawner } from "../../web_sockets/types_transfert.js";

const CANON_DIMENSION = new babylon.Vector3(3, 3, 6);

class Canon {
	private readonly canon: babylon.Mesh;
	private readonly body: babylon.PhysicsBody;
	private readonly canonSceneObservable: babylon.Observable<babylon.Scene>;
	private readonly canonSceneObserver: babylon.Observer<babylon.Scene>;
	private readonly id: number;
	private readonly sockets: WebSocket[];
	private currentLifetime = 1;
	private currentLinearVelocity: babylon.Vector3 = new babylon.Vector3(10, 0, 0);

	constructor(scene: babylon.Scene, id: number, sockets: WebSocket[]) {
		this.canon = babylon.MeshBuilder.CreateBox("canon", { width: CANON_DIMENSION.x, height: CANON_DIMENSION.y, depth: CANON_DIMENSION.z }, scene);
		
		this.canon.position = new babylon.Vector3(0, CANON_DIMENSION.y / 2, MAP_SIZE.z / 2 - WALL_WIDTH * 2);

		this.id = id;
		this.sockets = sockets;
		this.canon.metadata = { stun: Math.random() < 0.5 ? "spin" : "normal" };
		this.body = this.setCanonPhysic(scene);
		this.canonSceneObservable = scene.onBeforeRenderObservable;
		this.canonSceneObserver = this.canonObserveScene();
	}

	getCanonTip(): babylon.Vector3 {
		const canonTip = this.canon.position;
		canonTip.z -= CANON_DIMENSION.z;
		return canonTip;
	}

	private canonObserveScene(): babylon.Observer<babylon.Scene> {
		const canonSceneObserver = this.canonSceneObservable.add(() => {
			if (this.canon.position.x >= MAP_SIZE.z / 4
			|| this.canon.position.x <= -MAP_SIZE.z / 4)
				this.currentLinearVelocity = this.currentLinearVelocity.scale(-1);
			this.body.setLinearVelocity(this.currentLinearVelocity);
			this.sendObjectInfos();
		});
		return canonSceneObserver;
	}

	private setCanonPhysic(scene: babylon.Scene): babylon.PhysicsBody {
		const newBody = new babylon.PhysicsBody(this.canon, babylon.PhysicsMotionType.ANIMATED, false, scene);
		newBody.setMassProperties({
			mass: 1,
			centerOfMass: babylon.Vector3.Zero()
		});

		const shape = new babylon.PhysicsShapeBox(babylon.Vector3.Zero(), new babylon.Quaternion(0, 0, 0, 1), CANON_DIMENSION, scene);
		shape.material = { restitution: 1, friction: 0 };
		newBody.shape = shape;
		return newBody;
	}

	sendObjectInfos(): void {
		this.sockets.forEach(socket => {
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
					x: 0,
					y: 0,
					z: 0,
					w : 1
				},
				currentLifetime: this.currentLifetime
			};

			socket.send(JSON.stringify(infos));
		});
	}

	destroy(): void {
		this.canonSceneObservable.remove(this.canonSceneObserver);
		this.body?.dispose();
		this.canon?.dispose();
		this.currentLifetime = 0;
		this.sendObjectInfos();
	}
}

export { Canon };