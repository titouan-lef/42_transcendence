import * as babylon from "@babylonjs/core";
import { COLORS3, EMOTE_GROWSPEED, EMOTE_LIFETIME, EMOTE_MAXGROW, MAP_SIZE, PLAYER_DIMENSION } from "../settings/values.js";

export class Emote {
	private readonly image: babylon.Mesh;
	private timer = 0;
	private sceneObservable: babylon.Observable<babylon.Scene>;
	private sceneObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, texture: babylon.Texture, player: babylon.TransformNode) {
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene();
		this.image = this.createImage(scene, texture);
		this.image.renderingGroupId = 1;
		this.image.parent = player;
		this.image.position.y = PLAYER_DIMENSION.y + 2;
	}

	private createImage(scene: babylon.Scene, texture: babylon.Texture): babylon.Mesh {
		const plane = babylon.MeshBuilder.CreatePlane("emote", { size: 10 }, scene);
		plane.scaling.set(0.1, 0.1, 0.1);
		const material = new babylon.PBRMaterial("mat", scene);
		material.albedoTexture = texture.clone();
		material.albedoTexture.hasAlpha = true;
		material.unlit = true;
		plane.material = material;
		plane.billboardMode = babylon.Mesh.BILLBOARDMODE_ALL;
		return plane;
	}

	private observeScene(): babylon.Observer<babylon.Scene> {
		let grow = 0;
		const sceneObserver = this.sceneObservable.add(() => {
			grow += EMOTE_GROWSPEED;
			this.timer += 1;
			if (grow <= EMOTE_MAXGROW) {
				this.image.scaling.set(0.1 * grow, 0.1 * grow, 0.1 * grow);
				this.image.position.y += 0.5;
			}
			if (this.timer >= EMOTE_LIFETIME)
				this.destroy();
		});
		return sceneObserver;
	}

	destroy(): void {
		this.sceneObservable.remove(this.sceneObserver);
		this.image.material?.dispose();
		this.image.dispose();
	}
}