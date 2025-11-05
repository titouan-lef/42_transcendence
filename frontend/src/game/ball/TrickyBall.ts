import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS, TRICKY_BALL_EFFECT_INTERVAL, TRICKY_BALL_FORWARD_ONLY } from "../values.js";

export class TrickyBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;
	private readonly effectIntervalId: ReturnType<typeof setInterval>;
		
	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "tricky", texture);
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

	
	/**@todo changes direction every TRICKY_BALL_EFFECT_INTERVAL ms */
	activateEffect(): ReturnType<typeof setInterval> {
		const effectIntervalId = setInterval(() => {
			const speed = this.physic.body.getLinearVelocity().length();
			if (speed === 0)
				return;
			let randomDirX = Math.random() * 2 - 1;
			let randomDirZ = Math.random() * 2 - 1;
			let newDirection = new babylon.Vector3(randomDirX, 0, randomDirZ).normalize();
			if (TRICKY_BALL_FORWARD_ONLY) {
				const currentDirection = this.physic.body.getLinearVelocity().normalize();
				let goesForward = babylon.Vector3.Dot(currentDirection, newDirection) > 0.5;
				while (!goesForward) {
					randomDirX = Math.random() * 2 - 1;
					randomDirZ = Math.random() * 2 - 1;
					newDirection = new babylon.Vector3(randomDirX, 0, randomDirZ).normalize();
					goesForward = babylon.Vector3.Dot(currentDirection, newDirection) > 0.5;
				}
			}
			this.physic.body.setLinearVelocity(newDirection.scale(speed));
			this.showParticles(this.mesh.position, this.mesh.getScene(), "impulse");
		}, TRICKY_BALL_EFFECT_INTERVAL);
		return effectIntervalId;
	}
		
	destroyRest(): void {
		clearInterval(this.effectIntervalId);
		clearInterval(this.trailIntervalId);
	}
}
