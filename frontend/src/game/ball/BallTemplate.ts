import * as babylon from "@babylonjs/core";
import { BallOption } from "../GameSettings.js";
import { BALL_DIAMETER, TRAIL_CREATION_INTERVAL } from "../values.js";
import { BallTrail } from "./BallTrail.js";

export abstract class BallTemplate {
	readonly mesh: babylon.Mesh;
	private readonly type: BallOption;
	protected readonly ballTrails: BallTrail[] = [];

	constructor(scene: babylon.Scene, type: BallOption, spin: boolean) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.mesh.position.y = BALL_DIAMETER / 2;
		this.mesh.renderingGroupId = 1;
		this.type = type;
	}

	protected setTrail(scene: babylon.Scene, color: babylon.Color3): ReturnType<typeof setInterval> {
		const trailIntervalId = setInterval(() => {
			this.ballTrails.push(new BallTrail(scene, this.mesh.absolutePosition, color));
			while (this.ballTrails.length && this.ballTrails[0].hasDisappeared()) {
				this.ballTrails.splice(0, 1);
			}
		}, TRAIL_CREATION_INTERVAL);
		return trailIntervalId;
	}

	destroy(): void {
		this.destroyRest();
		while (this.ballTrails.length) {
			this.ballTrails[0].destroy();
			this.ballTrails.splice(0, 1);
		}
		this.mesh.material?.dispose();
		this.mesh.dispose();
	}

	abstract setMaterial(scene: babylon.Scene, color: babylon.Color3): void;

	abstract destroyRest(): void;
}
