import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class InvisibleBall extends BallTemplate {
	private readonly material: babylon.StandardMaterial;
		
	constructor(scene: babylon.Scene) {
		super(scene, "invisible");
		this.material = new babylon.StandardMaterial('ballcolor', scene);
		this.material.emissiveColor =  COLORS.yellow;
		this.mesh.material = this.material;
	}

	destroyRest(): void {
		this.material.dispose();
	}

	/**@todo disappears every 5sec for 1sec */
	activateEffet(): void {
		
	}
}