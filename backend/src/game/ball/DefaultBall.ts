import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { WebSocket } from "ws";

export class DefaultBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], windAffected: boolean) {
		super(scene, "default", sockets, windAffected);
	}

	activateEffect(): void {}
}
