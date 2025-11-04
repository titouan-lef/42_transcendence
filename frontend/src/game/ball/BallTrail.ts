import * as babylon from "@babylonjs/core";
import { BALL_DIAMETER } from "../values.js";

export class BallTrail {
	private readonly mesh: babylon.Mesh;
	private readonly intervalId: ReturnType<typeof setInterval>;
	private isFaded = false;

	constructor(scene: babylon.Scene, position: babylon.Vector3, color: babylon.Color3, visibility?: number) {
		this.mesh = babylon.MeshBuilder.CreateSphere("ballTrail", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.mesh.position = position;
		this.mesh.renderingGroupId = 1;
		this.setMaterial(scene, color);
		this.mesh.visibility = visibility ?? 1;
		this.mesh.visibility *= 0.35;
		this.intervalId = this.fadeOut();
	}

	private setMaterial(scene: babylon.Scene, color: babylon.Color3): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = color;
		this.mesh.material = material;
	}

	private fadeOut(): ReturnType<typeof setInterval> {
		const intervalId = setInterval(() => {
			this.mesh.visibility -= 0.1;
			if (this.mesh.visibility <= 0) {
				this.destroy();
				this.isFaded = true;
			}
		}, 50);
		return intervalId;
	}

	hasDisappeared(): boolean {
		return this.isFaded;
	}

	destroy(): void {
		clearInterval(this.intervalId);
		this.mesh.material?.dispose();
		this.mesh?.dispose();
	}
}