import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { WebSocket } from "ws";

export class DefaultBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		super(scene, "default", sockets);
	}

	/**@description no effect */
	activateEffect(): void {}

	destroyRest(): void {}
}
