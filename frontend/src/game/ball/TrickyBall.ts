import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS, TRICKY_BALL_EFFECT_INTERVAL, TRICKY_BALL_EFFECT_FORCE } from "../values.js";

export class TrickyBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;
	private readonly effectIntervalId: ReturnType<typeof setInterval>;
		
	constructor(scene: babylon.Scene) {
		super(scene, "tricky");
		this.color = COLORS.orange;
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
		clearInterval(this.effectIntervalId);
		clearInterval(this.trailIntervalId);
	}

	/**@todo changes direction every TRICKY_BALL_EFFECT_INTERVAL ms */
	activateEffect(): ReturnType<typeof setInterval> {
		const effectIntervalId = setInterval(() => {
			const randomDirX = Math.random() * 2 - 1;
			const randomDirZ = Math.random() * 2 - 1;
			this.physic.body.setLinearVelocity(new babylon.Vector3
			(randomDirX * TRICKY_BALL_EFFECT_FORCE, 0, randomDirZ * TRICKY_BALL_EFFECT_FORCE));
			this.showParticles(this.mesh.position, this.mesh.getScene(), "impulse");
		}, TRICKY_BALL_EFFECT_INTERVAL);
		return effectIntervalId;
	}
}
