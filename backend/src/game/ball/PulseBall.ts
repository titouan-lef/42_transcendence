import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { MAX_SPEED, PULSE_BALL_EFFECT_INTERVAL } from "../settings/values.js";
import { WebSocket } from "ws";
import { vec3ToPos } from "../utils.js";

export class PulseBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		super(scene, "pulse", sockets);
	}

	activateEffect(): void {
		this.effectInterval++;
		if (this.effectInterval >= PULSE_BALL_EFFECT_INTERVAL) {
			this.effectInterval -= PULSE_BALL_EFFECT_INTERVAL;

			const velocity = this.physic.body.getLinearVelocity();
			if (velocity.length() < MAX_SPEED * 0.85) {
				const randomImpulse = (Math.random() / 2 + 0.5); // 0.5 -- 1
				this.physic.body.applyImpulse(
					velocity.scale(randomImpulse),
					this.mesh.position);
			} else {
				const randomImpulse = -Math.random() / 2; // 0 -- -0.5
				this.physic.body.applyImpulse(
					velocity.scale(randomImpulse),
					this.mesh.position);
			}
			this.sendParticuleEvent(this.sockets, "impulse", vec3ToPos(this.mesh.position));
		}
	}
}