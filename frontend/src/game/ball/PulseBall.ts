import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS, MAX_SPEED, PULSE_BALL_EFFECT_INTERVAL } from "../values.js";
import { GameSettings } from "../GameSettings.js";

export class PulseBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;
	private readonly effectIntervalId: ReturnType<typeof setInterval>;
	
	constructor(scene: babylon.Scene, settings: GameSettings) {
		super(scene, "pulse", settings.spin);
		this.color = COLORS.blue;
		this.setMaterial(scene, this.color);
		this.trailIntervalId = this.setTrail(scene, this.color);
		this.effectIntervalId = this.activateEffect();
	}
	
	setMaterial(scene: babylon.Scene, color: babylon.Color3): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = color;
		this.mesh.material = material;
	}

	destroyRest(): void {
		clearInterval(this.trailIntervalId);
		clearInterval(this.effectIntervalId);
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
				this.showParticles(this.mesh.position, this.mesh.getScene());
			} else {
				const randomImpulse = -Math.random() / 2; // 0 -- -0.5
				this.physic.body.applyImpulse(
					velocity.scale(randomImpulse),
					this.mesh.position);
			}
		}, PULSE_BALL_EFFECT_INTERVAL);
		return effectIntervalId;
	}
}