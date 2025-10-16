import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class SnakeBall extends BallTemplate {
	private readonly material: babylon.StandardMaterial;
		
	constructor(scene: babylon.Scene) {
		super(scene, "snake");
		this.material = new babylon.StandardMaterial('ballcolor', scene);
		this.material.emissiveColor =  COLORS.green;
		this.mesh.material = this.material;
	}

	destroyRest(): void {
		this.material.dispose();
	}

	/**@todo gain a impulse on a side then on an other, ect */
	activateEffet(): void {
		
	}
}