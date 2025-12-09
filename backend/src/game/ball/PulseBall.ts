import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS3, PULSE_BALL_EFFECT_INTERVAL } from "../settings/values.js";
import { WebSocket } from "ws";
import { vec3ToPos } from "../utils.js";
import { GameSettings } from "../settings/GameSettings.js";

class PulseBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], settings: GameSettings) {
		super(scene, "pulse", sockets, settings);
		this.particleColor = COLORS3.blue;
	}

	activateEffect(): void {
		if (this.effectInterval < PULSE_BALL_EFFECT_INTERVAL)
			return;
		this.effectInterval -= PULSE_BALL_EFFECT_INTERVAL;

		const velocity = this.physic.body.getLinearVelocity();
		let randomImpulse: number;
		if (velocity.length() < this.maxSpeed * 0.85)
			randomImpulse = Math.random() / 2 + 0.5; // 0.5 -- 1
		else
			randomImpulse = -Math.random() / 2; // 0 -- -0.5
		this.physic.body.applyImpulse(velocity.scale(randomImpulse), this.mesh.position);
		this.sendParticuleEvent(this.sockets, "impulse", vec3ToPos(this.mesh.position), 1);
	}
}

export { PulseBall };
