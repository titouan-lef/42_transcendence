import * as babylon from "@babylonjs/core";
import { GameSettings } from "../settings/GameSettings.js";
import { DataMessage, PlanePosition, PlayerControls, PositionsMessage, Status } from "../../web_sockets/types_transfert.js";
import { Player } from "./Player.js";
import { PLAYER_DIMENSION } from "../settings/values.js";

class AI extends Player {

	private ballPosition: PlanePosition;
	private interval?: ReturnType<typeof setInterval>;

	constructor(scene: babylon.Scene, position: babylon.Vector2, gameSettings: GameSettings) {
		super(scene, position, gameSettings, 2);
		this.ballPosition = { x: 0, z: 0 };

		this.interval = setInterval(() => {
			this.update();
		}, 400); /** @todo change to 1000 to be every second */
	}

	update(): void { /** @todo real AI */
		const controls: PlayerControls = {
			mov_right: false,
			mov_left: false,
			rot_right: false,
			rot_left: false,
			normalMode: false,
			spinMode: false
		};
		const sign = this.ballPosition.z - this.getPosition().z;
		if (sign > PLAYER_DIMENSION.z / 3)
			controls.mov_right = true;
		else if (sign < -PLAYER_DIMENSION.z / 3)
			controls.mov_left = true;
		this.setControls(controls);
	}

	async send(message: DataMessage): Promise<void> {
		if (message.status === Status.POSITIONS) {
			this.ballPosition = message.ball;
		}
	}

	getName(): string {
		return "AI";
	}

	destroy(): void {
		super.destroy();
		clearInterval(this.interval);
	}
}

export { AI };