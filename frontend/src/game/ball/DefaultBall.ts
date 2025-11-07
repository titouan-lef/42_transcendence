import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";
import { COLORS3 } from "../settings/values.js";

export class DefaultBall extends BallTemplate {
	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "default", texture, COLORS3.white);
	}

	/**@description no effect */
	activateEffect(): void {}

	destroyRest(): void {}
}
