import * as babylon from "@babylonjs/core";
import { PLAYER_DIMENSION } from "./../values.js";
import { COLORS } from "./../values.js";

export class PlayerTrail {
	private readonly mesh: babylon.Mesh;
	private readonly intervalId: ReturnType<typeof setInterval>;
	private isFaded = false;

	constructor(scene: babylon.Scene, player: babylon.Mesh) {
		this.mesh = babylon.MeshBuilder.CreateBox("playerTrail", { width: PLAYER_DIMENSION.x, height: PLAYER_DIMENSION.y, depth: PLAYER_DIMENSION.z }, scene);
		this.mesh.position = player.position.clone();
		if (player.rotationQuaternion)
			this.mesh.rotationQuaternion = player.rotationQuaternion.clone();
		if (player.material)
			this.mesh.material = player.material.clone("trailMat");
		this.mesh.renderingGroupId = 1;
		this.mesh.visibility = 0.20;
		this.intervalId = this.fadeOut();
	}

	private fadeOut(): ReturnType<typeof setInterval> {
		const intervalId = setInterval(() => {
			this.mesh.visibility -= 0.04;
			if (this.mesh.visibility <= 0) {
				this.destroy();
				this.isFaded = true;
			}
		}, 15);
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