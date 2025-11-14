import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS3 } from "../settings/values.js";

export class TrickyBall extends BallTemplate {

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "tricky", texture, COLORS3.orange);
	}
	
	/** @todo changes direction when back says to */
	activateEffect(): void {
		this.showParticles(this.mesh.position, this.mesh.getScene(), "impulse");
	}
		
	destroyRest(): void {
	}
}
