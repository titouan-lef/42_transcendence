import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS3, MAX_SPEED, PULSE_BALL_EFFECT_INTERVAL } from "../settings/values.js";

export class PulseBall extends BallTemplate {
	
	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "pulse", texture, COLORS3.blue);
	}

	/** @todo apply a pulsation when back says to */
	activateEffect(): void {
		if (this.gameStopped)
			return;
		this.showParticles(this.mesh.position, this.mesh.getScene(), "impulse");
	}

	destroyRest(): void {}
}