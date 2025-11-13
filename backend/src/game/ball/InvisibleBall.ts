import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS3, BALL_TRAIL_INTERVAL, INVISIBLE_BALL_FADING_INTERVAL, INVISIBLE_BALL_INVISIBILITY_INTERVAL } from "../settings/values.js";

export class InvisibleBall extends BallTemplate {
	private readonly effectIntervalId: ReturnType<typeof setInterval>;
	private effectTimeOutId: ReturnType<typeof setTimeout> | null = null;
		
	constructor(scene: babylon.Scene) {
		super(scene, "invisible");
		this.effectIntervalId = this.activateEffect();
	}
	
	/**disappears gradually every INVISIBLE_BALL_FADING_INTERVAL ms for INVISIBLE_BALL_INVISIBILITY_INTERVAL ms */
	activateEffect(): ReturnType<typeof setInterval> {
		const effectIntervalId = setInterval(() => {
			if (this.gameStopped)
				return;
			if (this.mesh.visibility > 0 && this.effectTimeOutId === null)
				this.mesh.visibility -= 0.01;
			else {
				if (this.effectTimeOutId === null) {
					this.effectTimeOutId = setTimeout(() => {
						this.mesh.visibility = 1;
						this.effectTimeOutId = null;
					}, INVISIBLE_BALL_INVISIBILITY_INTERVAL);
				}
			}
		}, INVISIBLE_BALL_FADING_INTERVAL);
		return effectIntervalId;
	}

	destroyRest(): void {
		clearInterval(this.effectIntervalId);
		if (this.effectTimeOutId !== null) {
			clearTimeout(this.effectTimeOutId);
		}
	}
}
