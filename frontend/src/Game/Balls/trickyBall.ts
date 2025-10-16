import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class TrickyBall extends BallTemplate {
	private readonly material: babylon.StandardMaterial;
		
	constructor(scene: babylon.Scene) {
		super(scene, "tricky");
		this.material = new babylon.StandardMaterial('ballcolor', scene);
		this.material.emissiveColor =  COLORS.purple;
		this.mesh.material = this.material;
	}

	destroyRest(): void {
		this.material.dispose();
	}

	/**@todo changes direction every 5sec */
	activateEffet(): void {
		
	}
}