import * as babylon from "/babylonjs/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class HeavyBall extends BallTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "heavy");
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor =  COLORS.grey;
		this.mesh.material = material;
	}

	/** @description no effect */
	activateEffet(): void {
		return ;
	}
}