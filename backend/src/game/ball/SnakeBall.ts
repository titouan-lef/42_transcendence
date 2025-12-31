import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS3, SNAKE_BALL_ANGULAR_FORCE, SNAKE_BALL_ANGULAR_INTERVAL } from "../settings/values.js";
import { WebSocket } from "ws";
import { GameSettings } from "../settings/GameSettings.js";

class SnakeBall extends BallTemplate {
	private snakeTime = 0;

	constructor(scene: babylon.Scene, sockets: WebSocket[], settings: GameSettings) {
		super(scene, "snake", sockets, settings);
		this.force = SNAKE_BALL_ANGULAR_FORCE;
		this.particleColor = COLORS3.green;
	}

	activateEffect(): void {};

	/** Redefine MovementChanges since spin doesn t apply to snake ball */
	applyMovementChanges(scene: babylon.Scene): void {
		// Parameters
		this.adjustSpeed(scene);
		const velocity = this.physic.body.getLinearVelocity();
		const speedRatio = Math.max(0.2, Math.min(velocity.length() / this.originalMaxSpeed, 2.0));
		this.snakeTime = (this.snakeTime || 0) + scene.metadata.gameSpeed * speedRatio;
		const frequency = 1 / SNAKE_BALL_ANGULAR_INTERVAL;
		const oscillation = Math.sin(this.snakeTime * frequency);

		const dir = velocity.clone();
		dir.y = 0;
		if (dir.lengthSquared() < 0.0001)
			return;
		dir.normalize();
		const side = new babylon.Vector3(-dir.z, 0, dir.x);
		const amplitude = speedRatio * SNAKE_BALL_ANGULAR_FORCE * this.maxSpeed / this.originalMaxSpeed;
		const lateralForce = side.scale(oscillation * amplitude);

		console.log(lateralForce, oscillation, side);
		// Apply force
		this.physic.body.applyForce(
			lateralForce,
			this.mesh.position
		);
	}
}

export { SnakeBall };
