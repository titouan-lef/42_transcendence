import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { WebSocket } from "ws";
import { GameSettings } from "../settings/GameSettings.js";

class DefaultBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], settings: GameSettings) {
		super(scene, "default", sockets, settings);
	}

	activateEffect(): void {}
}

export { DefaultBall };
