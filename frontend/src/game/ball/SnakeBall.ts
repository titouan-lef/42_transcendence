import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS, SNAKE_BALL_ANGULAR_FORCE, SNAKE_BALL_ANGULAR_INTERVAL } from "../values.js";

export class SnakeBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;

	constructor(scene: babylon.Scene) {
		super(scene, "snake");
		this.color = COLORS.green;
		this.setMaterial(scene, this.color);
		this.force = SNAKE_BALL_ANGULAR_FORCE;
		this.trailIntervalId = this.setTrail(scene, this.color);
	}

	setMaterial(scene: babylon.Scene, color: babylon.Color3): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = color;
		this.mesh.material = material;
	}

	destroyRest(): void {
		clearInterval(this.trailIntervalId);
	}

	/**@todo nothing */
	activateEffect(): void {};

	/** Redefine MovementChanges since spin doesn t apply to snake ball */
	/** ball moves with a snake pattern */
	applyMovementChanges(): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			if (this.justCollided) {
				this.realDirection = this.physic.body.getLinearVelocity();
				this.justCollided = false;
				this.force = SNAKE_BALL_ANGULAR_FORCE;
			}

			if (this.force >= SNAKE_BALL_ANGULAR_FORCE || this.force <= 0)
				this.forceDirection *= -1;
			this.force -= (SNAKE_BALL_ANGULAR_FORCE / SNAKE_BALL_ANGULAR_INTERVAL) * this.forceDirection;
			this.force = Math.max(0, Math.min(this.force, SNAKE_BALL_ANGULAR_FORCE)); // to deny force to go bellow 0 or max because division does shit

			this.physic.body.applyForce(
				new babylon.Vector3(this.realDirection.z * this.force, 0, -this.realDirection.x * this.force),
				this.mesh.position
			);
			this.physic.body.applyForce(
				new babylon.Vector3(-this.realDirection.z * (SNAKE_BALL_ANGULAR_FORCE - this.force), 0, this.realDirection.x * (SNAKE_BALL_ANGULAR_FORCE - this.force)),
				this.mesh.position
			);
			this.nerfSpeed();
		});
		return sceneObserver;
	}
}
