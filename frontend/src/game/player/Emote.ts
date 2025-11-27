import * as babylon from "@babylonjs/core";
import { COLORS3, EMOTE_LIFETIME, MAP_SIZE, PLAYER_DIMENSION } from "../settings/values.js";

export class Emote {
	private readonly image: babylon.Mesh;
	private timer = 0;
	private sceneObservable: babylon.Observable<babylon.Scene>;
	private sceneObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, texture: babylon.Texture, player: babylon.TransformNode) {
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene);
		this.image = this.createImage(scene, texture);
		this.image.renderingGroupId = 1;
		this.image.parent = player;
		this.image.position.y = PLAYER_DIMENSION.y + 7;
	}

	private createImage(scene: babylon.Scene, texture: babylon.Texture): babylon.Mesh {
		const plane = babylon.MeshBuilder.CreatePlane("emote", { size: 10 }, scene);
		const material = new babylon.StandardMaterial("mat", scene);
		material.diffuseTexture = texture.clone();
		material.diffuseTexture.hasAlpha = true;
		material.disableLighting = true;
		material.emissiveColor = COLORS3.emoteEmissiveColor;

		// désactive post-process / tonemapping / exposure
		material.imageProcessingConfiguration.isEnabled = false;
		plane.material = material;
		plane.billboardMode = babylon.Mesh.BILLBOARDMODE_ALL;
		return plane;
	}

	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			this.timer += scene.getEngine().getDeltaTime() / EMOTE_LIFETIME;
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