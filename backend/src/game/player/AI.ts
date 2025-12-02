import * as babylon from "@babylonjs/core";
import { GameOptions } from "../settings/GameSettings.js";
import { DataMessage, PlayerControls } from "#shared/types_transfert.js";
import { Player } from "./Player.js";
import { BallTemplate } from "../ball/BallTemplate.js";
import { ActionAi, Brain } from "./Brain/Brain.js";
import { DefaultBrain } from "./Brain/concrete_brain/DefaultBrain.js";

class AI extends Player {
	private readonly updateInterval: ReturnType<typeof setInterval>;
	private readonly movementIntervalId: ReturnType<typeof setInterval>;
	private controls: PlayerControls;

	private brain: Brain;

	private isEndingShoot = false;
	private shootAnimationFrame = 0;

	constructor(scene: babylon.Scene, position: babylon.Vector2, options: GameOptions) {
		super(scene, position, options, 2, "AI");
		this.brain = new DefaultBrain();
		this.controls = this.getInitControl();
		this.movementIntervalId = this.movementInterval();
		this.updateInterval = setInterval(() => this.update(), 1000);
	}

	private getInitControl(): PlayerControls {
		return {
			mov_right: false,
			mov_left: false,
			rot_right: false,
			rot_left: false,
			normalMode: false,
			spinMode: false,
			emoteStrong: false,
			emoteSad: false,
			emoteLol: false,
			emoteAngry: false,
			dash: false
		};
	}

	private movementInterval(): ReturnType<typeof setInterval> {
		return setInterval(() => {
			this.movement();
			this.setControls(this.controls);
		}, 80); // let this like this
	}

	private movement(): void {
		if (this.isEndingShoot) {
			this.shootAnimationFrame++;
			if (this.shootAnimationFrame === 4) {
				this.isEndingShoot = false;
				this.shootAnimationFrame = 0;
				this.controls.normalMode = true;
				this.controls.emoteAngry = true;
			}
			return ;
		}
		this.controls = this.getInitControl();
		const action = this.brain.getAction(this.player.position.z);
		this.applyAction(action);
	}

	private applyAction(action: ActionAi): void {
		this.controls.mov_left = action.mov_left;
		this.controls.mov_right = action.mov_right;

		if (!action.atk_left && !action.atk_right) {
			this.shootAnimationFrame = 0;
			this.controls.normalMode = true;
			return ;
		}

		this.shootAnimationFrame++;
		if (this.shootAnimationFrame < 2) {// shoot
			if (action.atk_right)
				this.controls.rot_right = true;
			else
				this.controls.rot_left = true;
		} else if (this.shootAnimationFrame === 2) { //reset
			this.isEndingShoot = true;
		}
	}

	setBallToWatch(ball: BallTemplate): void {
		this.brain.setBallToWatch(ball);
	}

	update(): void { /** @todo real AI */
		this.brain.refreshView();
	}

	async send(message: DataMessage): Promise<void> {
		// if (message.status === Status.POSITIONS) {
		// 	this.ballPosition = message.ball;
		// }
	}

	destroy(): void {
		super.destroy();
		clearInterval(this.updateInterval);
		clearInterval(this.movementIntervalId);
	}
}

export { AI };
