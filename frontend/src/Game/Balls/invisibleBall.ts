import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS, TRAIL_CREATION_INTERVAL, INVISIBLE_BALL_FADING_INTERVAL, INVISIBLE_BALL_INVISIBILITY_INTERVAL } from "../values.js";
import { BallTrail } from "./ballTrail.js";

export class InvisibleBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;
	private readonly color: babylon.Color3 = COLORS.red;
	private readonly effectIntervalId: ReturnType<typeof setInterval>;
	private effectTimeOutId: ReturnType<typeof setTimeout> | null = null;
		
	constructor(scene: babylon.Scene) {
		super(scene, "invisible");
		this.setMaterial(scene, this.color);
		this.trailIntervalId = this.setTrail(scene, this.color);
		this.effectIntervalId = this.activateEffet();
	}
	
	setMaterial(scene: babylon.Scene, color: babylon.Color3): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = color;
		this.mesh.material = material;
	}

	/** redefining setTrail to specify the visibility of the current ball */
	protected setTrail(scene: babylon.Scene, color: babylon.Color3): ReturnType<typeof setInterval> {
		const trailIntervalId = setInterval(() => {
			this.ballTrails.push(new BallTrail(scene, this.mesh.absolutePosition, color, this.mesh.visibility));
			while (this.ballTrails.length && this.ballTrails[0].hasDisappeared()) {
				this.ballTrails.splice(0, 1);
			}
		}, TRAIL_CREATION_INTERVAL);
		return trailIntervalId;
	}
	
	/**@todo disappears gradually every 5sec for 1.2sec */
	activateEffet(): ReturnType<typeof setInterval> {
		const effectIntervalId = setInterval(() => {
			if (this.mesh.visibility > 0 && this.effectTimeOutId === null) {
				this.mesh.visibility -= 0.01;
			} else {
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
		clearInterval(this.trailIntervalId);
	}
}