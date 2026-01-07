import * as babylon from "@babylonjs/core";
import { GameOptions } from "../settings/GameSettings.js";
import { DataMessage, PlayerControls } from "#shared/types_transfert.js";
import { Player } from "./Player.js";
import { BallTemplate } from "../ball/BallTemplate.js";
import { ActionAi, Brain } from "./Brain/Brain.js";
import { DefaultBrain } from "./Brain/concrete_brain/DefaultBrain.js";

const REFRESH_VIEW = 1000;

class AI extends Player {
	private readonly updateIntervalId: ReturnType<typeof setInterval>;
	private readonly makeActionIntervalId: ReturnType<typeof setInterval>;
	private controls: PlayerControls;
	private brain: Brain;
	private isEndingShoot = false;
	private shootAnimationFrame = 0;
	private ballToWatch: BallTemplate | null;
	private isInNormalMode;

	constructor(scene: babylon.Scene, position: babylon.Vector2, options: GameOptions) {
		super(scene, position, options, 2, "AI");
		this.brain = new DefaultBrain(options.dashingPlayer, options.spin);
		this.controls = this.getInitControl();
		this.makeActionIntervalId = this.makeActionInterval();
		this.updateIntervalId = setInterval(() => this.update(), REFRESH_VIEW);
		this.ballToWatch = null;
		this.isInNormalMode = true;
	}

	private makeActionInterval(): ReturnType<typeof setInterval> {
		return setInterval(() => {
			this.defineControl();
			this.setControls(this.controls);
		}, 80); // let this like this
	}

	private defineControl(): void {
		if (this.isEndingShoot) {
			this.manageEndShoot();
			return ;
		}
		const action = this.brain.getAction(this.player.position.z);
		this.controls = this.getInitControl();
		this.applyAction(action);
	}

	private manageEndShoot(): void {
		this.shootAnimationFrame++;
		if (this.shootAnimationFrame !== 4)
			return;
		this.isEndingShoot = false;
		this.shootAnimationFrame = 0;
		this.resetRotation();
		this.controls.emoteAngry = true;
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

	private applyAction(action: ActionAi): void {
		if (action.changeMode) {
			this.isInNormalMode = (!this.isInNormalMode);
			this.resetRotation();
		}
		this.controls.mov_left = action.mov_left;
		this.controls.mov_right = action.mov_right;
		this.controls.dash = action.dash;
		if (!action.atk_left && !action.atk_right) {
			this.shootAnimationFrame = 0;
			this.resetRotation();
		} else
			this.manageShootAnimation(action);
	}

	private manageShootAnimation(action: ActionAi): void {
		this.shootAnimationFrame++;
		if (this.shootAnimationFrame > 2)
			return;
		if (this.shootAnimationFrame < 2) {// Shoot.
			if (action.atk_right)
				this.controls.rot_right = true;
			else
				this.controls.rot_left = true;
		} else// Reset.
			this.isEndingShoot = true;
	}

	private resetRotation(): void {
		if (this.isInNormalMode)
			this.controls.normalMode = true;
		else
			this.controls.spinMode = true;
	}

	setBallToWatch(ball: BallTemplate): void {
		this.ballToWatch = ball;
		/** @todo define brain here I think */
	}

	update(): void { /** @todo real AI */
		this.brain.refreshView(this.ballToWatch);
	}

	async send(message: DataMessage): Promise<void> {
		// if (message.status === Status.POSITIONS) {
		// 	this.ballPosition = message.ball;
		// }
	}

	destroy(): void {
		super.destroy();
		clearInterval(this.updateIntervalId);
		clearInterval(this.makeActionIntervalId);
	}
}

export { AI };
