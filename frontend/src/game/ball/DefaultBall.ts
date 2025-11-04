import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";

export class DefaultBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "default", texture);
		this.setMaterial(scene, this.color);
		this.trailIntervalId = this.setTrail(scene, this.color);
	}

	setMaterial(scene: babylon.Scene, color: babylon.Color3): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = color;
		this.mesh.material = material;
	}

	/**@description no effect */
	activateEffect(): void {}

	destroyRest(): void {
		clearInterval(this.trailIntervalId);
	}
}
