import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { TRICKY_BALL_EFFECT_INTERVAL, TRICKY_BALL_FORWARD_ONLY } from "../settings/values.js";
import { WebSocket } from "ws";
import { vec3ToPos } from "../utils.js";
import { GameSettings } from "../settings/GameSettings.js";

class TrickyBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], settings: GameSettings) {
		super(scene, "tricky", sockets, settings);
	}
	
	activateEffect(): void {
		if (this.effectInterval < TRICKY_BALL_EFFECT_INTERVAL)
			return;
		this.effectInterval -= TRICKY_BALL_EFFECT_INTERVAL;
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
		this.sendParticuleEvent(this.sockets, "impulse", vec3ToPos(this.mesh.position));
	}
}

export { TrickyBall };