import * as babylon from "@babylonjs/core";
import { BallTemplate } from "./BallTemplate.js";

export class DefaultBall extends BallTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "default");
	}

	/**@description no effect */
	activateEffect(): void {}

	destroyRest(): void {}
}
