import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { SNAKE_BALL_ANGULAR_FORCE, SNAKE_BALL_ANGULAR_INTERVAL } from "../settings/values.js";
import { WebSocket } from "ws";

class SnakeBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], windAffected: boolean) {
		super(scene, "snake", sockets, windAffected);
		this.force = SNAKE_BALL_ANGULAR_FORCE;
	}

	activateEffect(): void {};

	/** Redefine MovementChanges since spin doesn t apply to snake ball */
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
			this.force = Math.max(0, Math.min(this.force, SNAKE_BALL_ANGULAR_FORCE));

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

export { SnakeBall };
