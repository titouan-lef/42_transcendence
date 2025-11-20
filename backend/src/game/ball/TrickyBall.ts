import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { TRICKY_BALL_EFFECT_INTERVAL, TRICKY_BALL_FORWARD_ONLY } from "../settings/values.js";
import { WebSocket } from "ws";
import { vec3ToPos } from "../utils.js";

export class TrickyBall extends BallTemplate {
	private readonly effectIntervalId: ReturnType<typeof setInterval>;
		
	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		super(scene, "tricky", sockets);
		this.effectIntervalId = this.activateEffect();
	}
	
	/**changes direction every TRICKY_BALL_EFFECT_INTERVAL ms */
	activateEffect(): ReturnType<typeof setInterval> {
		const effectIntervalId = setInterval(() => {
			if (this.gameStopped)
				return;
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
		}, TRICKY_BALL_EFFECT_INTERVAL);
		return effectIntervalId;
	}
		
	destroyRest(): void {
		clearInterval(this.effectIntervalId);
	}
}
