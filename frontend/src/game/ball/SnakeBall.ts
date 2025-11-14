import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS3, SNAKE_BALL_ANGULAR_FORCE, SNAKE_BALL_ANGULAR_INTERVAL } from "../settings/values.js";

export class SnakeBall extends BallTemplate {

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "snake", texture, COLORS3.green);
	}

	/**@description no effect */
	activateEffect(): void {};

	destroyRest(): void {}
}
