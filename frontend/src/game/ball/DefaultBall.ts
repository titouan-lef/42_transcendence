import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";

export class DefaultBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;

	constructor(scene: babylon.Scene) {
		super(scene, "default");
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
