import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS, TRICKY_BALL_EFFECT_INTERVAL, TRICKY_BALL_EFFECT_FORCE } from "../values.js";
import { GameSettings } from "../gameSettings.js";

export class TrickyBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;
	private readonly color: babylon.Color3 = COLORS.orange;
	private readonly effectIntervalId: ReturnType<typeof setInterval>;
		
	constructor(scene: babylon.Scene, settings: GameSettings) {
		super(scene, "tricky", settings.spin);
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

	/**@todo changes direction every 5sec */
	activateEffect(): ReturnType<typeof setInterval> {
		const effectIntervalId = setInterval(() => {
			const randomDirX = Math.random() * 2 - 1;
			const randomDirZ = Math.random() * 2 - 1;
			this.physic.body.setLinearVelocity(new babylon.Vector3
			(randomDirX * TRICKY_BALL_EFFECT_FORCE, 0, randomDirZ * TRICKY_BALL_EFFECT_FORCE));
		}, TRICKY_BALL_EFFECT_INTERVAL);
		return effectIntervalId;
	}
}