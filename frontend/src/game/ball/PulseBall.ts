import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS, MAX_SPEED, PULSE_BALL_EFFECT_INTERVAL } from "../values.js";

export class PulseBall extends BallTemplate {
	private readonly effectIntervalId: ReturnType<typeof setInterval>;
	
	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "pulse", texture, COLORS.blue);
		this.effectIntervalId = this.activateEffect();
	}

	/**@description apply a pulsation every PULSE_BALL_EFFECT_INTERVAL ms */
	activateEffect(): ReturnType<typeof setInterval> {
		const effectIntervalId = setInterval(() => {
			const velocity = this.physic.body.getLinearVelocity();
			if (velocity.length() < MAX_SPEED * 0.85) {
				const randomImpulse = (Math.random() / 2 + 0.5); // 0.5 -- 1
				this.physic.body.applyImpulse(
					velocity.scale(randomImpulse),
					this.mesh.position);
				this.showParticles(this.mesh.position, this.mesh.getScene(), "impulse");
			} else {
				const randomImpulse = -Math.random() / 2; // 0 -- -0.5
				this.physic.body.applyImpulse(
					velocity.scale(randomImpulse),
					this.mesh.position);
			}
		}, PULSE_BALL_EFFECT_INTERVAL);
		return effectIntervalId;
	}

	destroyRest(): void {
		clearInterval(this.effectIntervalId);
	}
}