import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS3, SNAKE_BALL_ANGULAR_FORCE, SNAKE_BALL_ANGULAR_INTERVAL } from "../settings/values.js";
import { WebSocket } from "ws";
import { GameSettings } from "../settings/GameSettings.js";

class SnakeBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], settings: GameSettings) {
		super(scene, "snake", sockets, settings);
		this.force = SNAKE_BALL_ANGULAR_FORCE;
		this.particleColor = COLORS3.green;
	}

	activateEffect(): void {};

	/** Redefine MovementChanges since spin doesn t apply to snake ball */
	applyMovementChanges(scene: babylon.Scene): void {
		if (this.justCollided) {
			this.realDirection = this.physic.body.getLinearVelocity();
			this.justCollided = false;
			this.force = SNAKE_BALL_ANGULAR_FORCE;
		}
		if (this.force >= SNAKE_BALL_ANGULAR_FORCE || this.force <= 0)
			this.forceDirection *= -1;
		this.force -= (SNAKE_BALL_ANGULAR_FORCE / SNAKE_BALL_ANGULAR_INTERVAL) * this.forceDirection;
		this.force = Math.max(0, Math.min(this.force, SNAKE_BALL_ANGULAR_FORCE));

		this.physic.body.applyForce(
			new babylon.Vector3(this.realDirection.z * this.force, 0, -this.realDirection.x * this.force),
			this.mesh.position
		);
		this.physic.body.applyForce(
			new babylon.Vector3(-this.realDirection.z * (SNAKE_BALL_ANGULAR_FORCE - this.force), 0, this.realDirection.x * (SNAKE_BALL_ANGULAR_FORCE - this.force)),
			this.mesh.position
		);
		this.adjustSpeed(scene);
	}
}

export { SnakeBall };