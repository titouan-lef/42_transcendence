import * as babylon from "@babylonjs/core";
import { PLAYER_DIMENSION } from "../settings/values.js";
import { COLORS3 } from "../settings/values.js";

class PlayerTrail {
	private readonly mesh: babylon.Mesh;
	private isFaded = false;
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, player: babylon.TransformNode) {
		this.mesh = babylon.MeshBuilder.CreateBox("playerTrail", { width: PLAYER_DIMENSION.x - 0.01, height: PLAYER_DIMENSION.y - 0.01, depth: PLAYER_DIMENSION.z - 0.01 }, scene);
		this.mesh.position = player.position.clone();
		if (player.rotationQuaternion)
			this.mesh.rotationQuaternion = player.rotationQuaternion.clone();
		this.setMaterial(scene);
		this.mesh.renderingGroupId = 1;
		this.mesh.visibility = 0.20;
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene();
	}

	private setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = COLORS3.grey;
		this.mesh.material = material;
	}


	private observeScene(): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			this.mesh.visibility -= 0.04;
			if (this.mesh.visibility <= 0) {
				this.destroy();
				this.isFaded = true;
			}
		});
		return sceneObserver;
	}

	hasDisappeared(): boolean {
		return this.isFaded;
	}

	destroy(): void {
		this.sceneObservable.remove(this.sceneObserver);
		this.mesh.material?.dispose();
		this.mesh?.dispose();
	}
}

export { PlayerTrail };