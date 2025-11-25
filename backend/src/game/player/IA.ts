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
	private ballPosPredict: babylon.Vector3 | null = null;
	private controls: PlayerControls;

	private wantToShootLeft = false;
	private wantToShootRight = false;
	private isShootingLeft = false;
	private isShootingRight = false;
	private isEndingShoot = false;
	private shootAnimationFrame = 0;

	constructor(scene: babylon.Scene, position: babylon.Vector2, gameSettings: GameSettings) {
		super(scene, position, gameSettings, 2);
		this.controls = {
			mov_right: false,
			mov_left: false,
			rot_right: false,
			rot_left: false,
			normalMode: false,
			spinMode: false
		};
		this.movementIntervalId = this.movement();
		this.updateInterval = setInterval(() => {
			this.update();
		}, 1);
	}

	private movement(): ReturnType<typeof setInterval> {
		const movementIntervalId = setInterval(() => {
			if (this.isEndingShoot) {
				this.shootAnimationFrame++;
				if (this.shootAnimationFrame === 4) {
					this.isEndingShoot = false;
					this.shootAnimationFrame = 0;
					this.controls.normalMode = true;
				}
				this.setControls(this.controls);
				return ;
			}
			this.resetState();
			if (!this.ballPosPredict) {
				this.goMiddle();
				this.shootAnimationFrame = 0;
				this.controls.normalMode = true;
			} else {
				this.defend();
				this.shoot();
			}
			this.setControls(this.controls);
		}, 80); // let this like this
		return movementIntervalId;
	}

	private resetState(): void {
		this.controls = {
			mov_right: false,
			mov_left: false,
			rot_right: false,
			rot_left: false,
			normalMode: false,
			spinMode: false
		};
		this.isShootingRight = this.wantToShootRight;
		this.isShootingLeft = this.wantToShootLeft;
		this.wantToShootLeft = false;
		this.wantToShootRight = false;
	}

	private goMiddle(): void {
		if (this.player.position.z <= -0.1)
			this.controls.mov_right = true;
		else if (this.player.position.z >= 0.1)
			this.controls.mov_left = true;
	}

	private shoot(): void {
		if ((!this.wantToShootLeft && !this.wantToShootRight)
		|| this.wantToShootLeft !== this.isShootingLeft
		|| this.wantToShootRight !== this.isShootingRight) {
			this.shootAnimationFrame = 0;
			this.controls.normalMode = true;	
			return ;
		}

		this.shootAnimationFrame++;
		//if (this.shootAnimationFrame <= 1) // elan
		//this.wantToShootRight ? this.controls.rot_left = true : this.controls.rot_right = true;
		if (this.shootAnimationFrame < 2) // shoot
			this.wantToShootRight ? this.controls.rot_right = true : this.controls.rot_left = true;
		else if (this.shootAnimationFrame === 2) { //reset
			this.isEndingShoot = true;
		}
	}

	private defend(): void {
		if (!this.ballPosPredict)
			return ;

		if (this.ballPosPredict.z < this.player.position.z - PLAYER_DIMENSION.z / 2)
			this.controls.mov_left = true; 
		else if (this.ballPosPredict.z > this.player.position.z + PLAYER_DIMENSION.z / 2)
			this.controls.mov_right = true;
		else {
			this.ballPosPredict.z < this.player.position.z ? this.wantToShootLeft = true : this.wantToShootRight = true;
		}
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
		//should not take bottom and topwall in account and should go middle if it hits bottomwall
		//return direction too ? so ia can choose to shoot or not
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

			//check player adverse aussi ?

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
		!predictedZ ? this.ballPosPredict = null : this.ballPosPredict = new babylon.Vector3(this.player.position.x, 0, predictedZ);
		console.log("predictedZ =" + predictedZ);
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