import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS, TRAIL_CREATION_INTERVAL } from "../values.js";
import { BallTrail } from "./BallTrail.js";
import { GameSettings } from "../GameSettings.js";

export class InvisibleBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;
	private readonly color: babylon.Color3 = COLORS.red;
	private effectTimeOutId: ReturnType<typeof setTimeout> | null = null;

	constructor(scene: babylon.Scene, settings: GameSettings) {
		super(scene, "invisible", settings.spin);
		this.setMaterial(scene, this.color);
		this.trailIntervalId = this.setTrail(scene, this.color);
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

	destroyRest(): void {
		if (this.effectTimeOutId !== null) {
			clearTimeout(this.effectTimeOutId);
		}
		clearInterval(this.trailIntervalId);
	}
}
