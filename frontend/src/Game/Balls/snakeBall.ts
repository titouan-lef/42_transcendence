import * as babylon from "/babylonjs/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class SnakeBall extends BallTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "snake");
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor =  COLORS.green;
		this.mesh.material = material;
	}

	/**@todo gain a impulse on a side then on an other, ect */
	activateEffet(): void {
		
	}
}