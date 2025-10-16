import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class DefaultBall extends BallTemplate {
	private readonly material: babylon.StandardMaterial;
	
	constructor(scene: babylon.Scene) {
		super(scene, "default");
		//TEST
		this.material = new babylon.StandardMaterial('ballcolor', scene);
		this.material.emissiveColor =  COLORS.white;
		this.mesh.material = this.material;
		//
	}

	destroyRest(): void {
		this.material.dispose();
	}

	/**@description no effect */
	activateEffet(): void {
		return;
	}
}