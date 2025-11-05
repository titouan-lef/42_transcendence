import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS, BALL_TRAIL_INTERVAL, INVISIBLE_BALL_FADING_INTERVAL, INVISIBLE_BALL_INVISIBILITY_INTERVAL } from "../settings/values.js";
import { BallTrail } from "./BallTrail.js";

export class InvisibleBall extends BallTemplate {
	private readonly effectIntervalId: ReturnType<typeof setInterval>;
	private effectTimeOutId: ReturnType<typeof setTimeout> | null = null;
		
	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "invisible", texture, COLORS.red);
		this.effectIntervalId = this.activateEffect();
	}
	
	/**@todo disappears gradually every INVISIBLE_BALL_FADING_INTERVAL ms for INVISIBLE_BALL_INVISIBILITY_INTERVAL ms */
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
