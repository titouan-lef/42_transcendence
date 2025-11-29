import * as babylon from "@babylonjs/core";
import { BallTemplate } from "../../ball/BallTemplate.js";
import { WebSocket } from "ws";
import { GameSettings } from "../../settings/GameSettings.js";
import { COLORS3, MAP_SIZE, WALL_WIDTH } from "../../settings/values.js";
import { ObjectMessage, Status, Object } from "../../web_sockets/types_transfert.js";

class CanonBall extends BallTemplate {
	private readonly canonSceneObservable: babylon.Observable<babylon.Scene>;
	private readonly canonSceneObserver: babylon.Observer<babylon.Scene>;
	private readonly id: number;
	private stunTarget;
	private currentLifetime = 1;

	constructor(scene: babylon.Scene, id: number, sockets: WebSocket[], settings: GameSettings) {
		super(scene, "default", sockets, settings);
		this.id = id;
		this.mesh.metadata.stun = Math.random() < 0.5 ? "spin" : "normal";
		this.stunTarget = this.mesh.metadata.stun === "spin" ? 1 : 0;
		this.particleColor = this.mesh.metadata.stun === "spin" ? COLORS3.red : COLORS3.white;
		this.canonSceneObservable = scene.onBeforeRenderObservable;
		this.canonSceneObserver = this.canonObserveScene();
	}

	activateEffect(): void {}

	private canonObserveScene(): babylon.Observer<babylon.Scene> {
		const canonSceneObserver = this.canonSceneObservable.add(() => {
			if (this.checkOutOfFieldBall(this.mesh.position) || this.isInGoal)
				this.destroy();
			this.sendObjectInfos();
		});
		return canonSceneObserver;
	}

	private checkOutOfFieldBall(position: babylon.Vector3): boolean {
		if (position.x > MAP_SIZE.x + WALL_WIDTH / 2
		|| position.x < -(MAP_SIZE.x + WALL_WIDTH / 2)
		|| position.z > MAP_SIZE.z + WALL_WIDTH / 2
		|| position.z < -(MAP_SIZE.z + WALL_WIDTH / 2)) {
			return true;
		}
		return false;
	}

	setPosition(position: babylon.Vector3): void {
		this.physic.body.disablePreStep = true;
		this.mesh.position = position;
		this.physic.body.disablePreStep = false;
	}

	sendObjectInfos(): void {
		this.sockets.forEach(socket => {
			const infos: ObjectMessage = {
				status: Status.OBJECT,
				type: Object.CANON_BALL,
				id: this.id,
				position: {
					x: this.mesh.position.x,
					y: this.mesh.position.y,
					z: this.mesh.position.z
				},
				size: this.stunTarget,
				currentLifetime: this.currentLifetime
			};

			socket.send(JSON.stringify(infos));
		});
	}

	destroy(): void {
		this.canonSceneObservable.remove(this.canonSceneObserver);
		this.currentLifetime = 0;
		super.destroy();
	}
}

export { CanonBall };