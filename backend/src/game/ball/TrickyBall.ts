import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { TRICKY_BALL_EFFECT_INTERVAL, TRICKY_BALL_FORWARD_ONLY } from "../settings/values.js";
import { WebSocket } from "ws";
import { vec3ToPos } from "../utils.js";

class TrickyBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], windAffected: boolean) {
		super(scene, "tricky", sockets, windAffected);
	}
	
	activateEffect(): void {
		this.effectInterval++;
		if (this.effectInterval < TRICKY_BALL_EFFECT_INTERVAL)
			return;
		this.effectInterval -= TRICKY_BALL_EFFECT_INTERVAL;
		const speed = this.physic.body.getLinearVelocity().length();
		if (speed === 0 || !TRICKY_BALL_FORWARD_ONLY)
			return;
		const currentDirection = this.physic.body.getLinearVelocity().normalize();
		let newDirection: babylon.Vector3;
		let goesForward: boolean;
		do {
			const randomDirX = Math.random() * 2 - 1;
			const randomDirZ = Math.random() * 2 - 1;
			newDirection = new babylon.Vector3(randomDirX, 0, randomDirZ).normalize();
			goesForward = babylon.Vector3.Dot(currentDirection, newDirection) > 0.5;
		} while (!goesForward);
		this.physic.body.setLinearVelocity(newDirection.scale(speed));
		this.sendParticuleEvent(this.sockets, "impulse", vec3ToPos(this.mesh.position));
	}
}

export { TrickyBall };
