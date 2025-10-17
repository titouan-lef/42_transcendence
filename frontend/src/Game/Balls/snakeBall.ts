import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class SnakeBall extends BallTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "snake");
		this.setMaterial(scene);
	}

	setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = COLORS.green;
		this.mesh.material = material;
	}

	destroyRest(): void {
		
	}

	/**@todo gain a impulse on a side then on an other, ect */
	activateEffet(): void {
		
	}
}