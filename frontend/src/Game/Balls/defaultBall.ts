import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class DefaultBall extends BallTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "default");
		this.setMaterial(scene);
	}
	
	setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = COLORS.white;
		this.mesh.material = material;
	}

	destroyRest(): void {

	}

	/**@description no effect */
	activateEffet(): void {
		return;
	}
}