import * as babylon from "/babylonjs/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS } from "../values.js";

export class TrickyBall extends BallTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "tricky");
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor =  COLORS.purple;
		this.mesh.material = material;
	}

	/**@todo changes direction every 5sec */
	activateEffet(): void {
		
	}
}