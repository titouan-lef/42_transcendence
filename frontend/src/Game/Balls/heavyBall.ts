import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class HeavyBall extends BallTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "heavy");
		this.setMaterial(scene);
		//this.physic.body.setMassProperties({mass: 100}); //check if it works
	}

	setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = COLORS.grey;
		this.mesh.material = material;
	}

	destroyRest(): void {
		
	}

	/** @description no effect */
	activateEffet(): void {
		return ;
	}
}