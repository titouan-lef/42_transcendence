import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { WebSocket } from "ws";
import { GameSettings } from "../settings/GameSettings.js";
import { COLORS3, INCREASE_GENERAL_SPEED_FACTOR } from "../settings/values.js";

class DefaultBall extends BallTemplate {
	constructor(scene: babylon.Scene, sockets: WebSocket[], settings: GameSettings) {
		super(scene, "default", sockets, settings);
		this.particleColor = COLORS3.white;
		this.speedIncreaseFactor = 2 * INCREASE_GENERAL_SPEED_FACTOR;
	}

	activateEffect(): void {}
}

export { DefaultBall };
