import * as babylon from "@babylonjs/core";
import { BALL_DIAMETER } from "../settings/values.js";

export class BallTrail {
	private readonly mesh: babylon.Mesh;
	private isFaded = false;
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, position: babylon.Vector3, color: babylon.Color3, visibility?: number) {
		this.mesh = babylon.MeshBuilder.CreateSphere("ballTrail", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.mesh.position = position;
		this.mesh.renderingGroupId = 1;
		this.setMaterial(scene, color);
		this.mesh.visibility = visibility ?? 1;
		this.mesh.visibility *= 0.35;
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene();
	}

	private setMaterial(scene: babylon.Scene, color: babylon.Color3): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = color;
		this.mesh.material = material;
	}

	private observeScene(): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			this.mesh.visibility -= 0.05;
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