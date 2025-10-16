import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class HeavyBall extends BallTemplate {
	private readonly material: babylon.StandardMaterial;
		
	constructor(scene: babylon.Scene) {
		super(scene, "heavy");
		this.material = new babylon.StandardMaterial('ballcolor', scene);
		this.material.emissiveColor =  COLORS.grey;
		this.mesh.material = this.material;
	}

	destroyRest(): void {
		this.material.dispose();
	}

	/** @description no effect */
	activateEffet(): void {
		return ;
	}
}