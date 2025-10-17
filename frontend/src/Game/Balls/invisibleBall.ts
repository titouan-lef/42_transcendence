import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class InvisibleBall extends BallTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "invisible");
		this.setMaterial(scene);
	}

	setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = COLORS.yellow;
		this.mesh.material = material;
	}

	destroyRest(): void {
		
	}

	/**@todo disappears every 5sec for 1sec */
	activateEffet(): void {
		
	}
}