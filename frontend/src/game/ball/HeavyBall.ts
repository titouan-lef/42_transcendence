import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS } from "../values.js";
import { GameSettings } from "../GameSettings.js";

export class HeavyBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;
	private readonly color: babylon.Color3 = COLORS.grey;

	constructor(scene: babylon.Scene, settings: GameSettings) {
		super(scene, "heavy", settings.spin);
		this.setMaterial(scene, this.color);
		this.trailIntervalId = this.setTrail(scene, this.color);
	}

	setMaterial(scene: babylon.Scene, color: babylon.Color3): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = color;
		this.mesh.material = material;
	}

	destroyRest(): void {
		clearInterval(this.trailIntervalId);
	}

	/**@description no effect */
	activateEffect(): void {
		return;
	}
}
