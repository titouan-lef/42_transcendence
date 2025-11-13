import * as babylon from "@babylonjs/core";
import { PLAYER_DIMENSION } from "../settings/values.js";
import { COLORS3 } from "../settings/values.js";

export class PlayerTrail {
	private readonly mesh: babylon.Mesh;
	private readonly intervalId: ReturnType<typeof setInterval>;
	private isFaded = false;

	constructor(scene: babylon.Scene, player: babylon.TransformNode) {
		this.mesh = babylon.MeshBuilder.CreateBox("playerTrail", { width: PLAYER_DIMENSION.x - 0.01, height: PLAYER_DIMENSION.y - 0.01, depth: PLAYER_DIMENSION.z - 0.01 }, scene);
		this.mesh.position = player.position.clone();
		if (player.rotationQuaternion)
			this.mesh.rotationQuaternion = player.rotationQuaternion.clone();
		this.setMaterial(scene);
		this.mesh.renderingGroupId = 1;
		this.mesh.visibility = 0.20;
		this.intervalId = this.fadeOut();
	}

	private setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = COLORS3.grey;
		this.mesh.material = material;
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