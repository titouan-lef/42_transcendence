import * as babylon from "@babylonjs/core";
import { GameSettings } from "../settings/GameSettings.js";
import { DataMessage, PlanePosition, PlayerControls, Status } from "../web_sockets/types_transfert.js";
import { Player } from "./Player.js";
import { MAP_SIZE, PLAYER_DIMENSION, WALL_WIDTH } from "../settings/values.js";
import { BallTemplate } from "../ball/BallTemplate.js";

class AI extends Player {
	private readonly updateInterval: ReturnType<typeof setInterval>;
	private ballToWatch: BallTemplate | null = null;
	private readonly movementIntervalId: ReturnType<typeof setInterval>;
	private ballPosPredict: babylon.Vector3;

	constructor(scene: babylon.Scene, position: babylon.Vector2, gameSettings: GameSettings) {
		super(scene, position, gameSettings, 2);
		this.ballPosPredict = new babylon.Vector3(this.player.position.clone().x, this.player.position.clone().y, 0);
		this.movementIntervalId = this.movement();
		this.updateInterval = setInterval(() => {
			this.update();
		}, 300);
	}

	private movement(): ReturnType<typeof setInterval> {
		const movementIntervalId = setInterval(() => {
			const controls: PlayerControls = {
				mov_right: false,
				mov_left: false,
				rot_right: false,
				rot_left: false,
				normalMode: false,
				spinMode: false
			};
			if (this.ballPosPredict.z < this.player.position.z - PLAYER_DIMENSION.z / 2)
				controls.mov_left = true;
			else if (this.ballPosPredict.z < this.player.position.z)
				controls.rot_left = true;
			if (this.ballPosPredict.z > this.player.position.z + PLAYER_DIMENSION.z / 2)
				controls.mov_right = true;
			else if (this.ballPosPredict.z > this.player.position.z + PLAYER_DIMENSION.z)
				controls.rot_right = true;
			this.setControls(controls);
		}, 10);
		return movementIntervalId;
	}

	private predictZAtPlayerX(): number | null {
		const playerPosX = this.getPosition().x;
		if (!this.ballToWatch)
			return null;
		const ballPosition = this.ballToWatch.getPosition();
		const ballDirection = this.ballToWatch.getDirection();
		let posX = ballPosition.x;
		let posZ = ballPosition.z;
		let dirX = ballDirection.x;
		let dirZ = ballDirection.z;

		if (dirX === 0)
			return null;

		const wallTop = -(MAP_SIZE.x + WALL_WIDTH) / 2;
		const wallBottom =  (MAP_SIZE.x + WALL_WIDTH) / 2;
		const wallLeft = -(MAP_SIZE.z + WALL_WIDTH) / 2;
		const wallRight =  (MAP_SIZE.z + WALL_WIDTH) / 2;

		for (let i = 0; i < 20; i++) {
			const tx = dirX > 0 ? (wallBottom - posX) / dirX : (wallTop - posX) / dirX; // le temps qu elle mettrait a toucher ce mur
			const tz = dirZ > 0 ? (wallRight - posZ) / dirZ : (wallLeft - posZ) / dirZ; // le temps qu elle mettrait a toucher ce mur

			const tPlayer = (playerPosX - posX) / dirX; // le temps qu elle mettrait a toucher la ligne du player

			if (tPlayer >= 0 && tPlayer <= Math.min(tx, tz)) {
				return posZ + dirZ * tPlayer; //si elle touche la ligne du player, alors on return ce Z
			}

			if (tx < tz) { // sinon on inverse la direction en fonction du mur touché
				posX = dirX > 0 ? wallBottom : wallTop;
				posZ += dirZ * tx;
				dirX *= -1;
			} else {
				posZ = dirZ > 0 ? wallRight : wallLeft;
				posX += dirX * tz;
				dirZ *= -1;
			}
		}

		return null;
	}

	setBallToWatch(ball: BallTemplate): void {
		this.ballToWatch = ball;
	}

	update(): void { /** @todo real AI */
		const predictedZ = this.predictZAtPlayerX();
		console.log("predictedZ =" + predictedZ);
		if (predictedZ !== null) {
			this.ballPosPredict.z = predictedZ;
			const controls: PlayerControls = {
				mov_right: false,
				mov_left: false,
				rot_right: false,
				rot_left: false,
				normalMode: false,
				spinMode: false
			};
			controls.spinMode = true;
			this.setControls(controls);
		}
		// if (predictedZ || predictedZ === 0)
		// 	this.player.position = new babylon.Vector3(this.player.position.clone().x, PLAYER_DIMENSION.y / 2, predictedZ);
	}

	async send(message: DataMessage): Promise<void> {
		// if (message.status === Status.POSITIONS) {
		// 	this.ballPosition = message.ball;
		// }
	}

	getName(): string {
		return "AI";
	}

	destroy(): void {
		super.destroy();
		clearInterval(this.updateInterval);
		clearInterval(this.movementIntervalId);
	}
}

export { AI };