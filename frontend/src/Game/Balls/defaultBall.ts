import * as babylon from "/babylonjs/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class DefaultBall extends BallTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "default");
		//TEST
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor =  COLORS.white;
		this.mesh.material = material;
		//
	}

	/**@description no effect */
	activateEffet(): void {
		return;
	}
}