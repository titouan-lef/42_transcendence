import * as babylon from "@babylonjs/core";
import { PLAYER_DIMENSION, STUN_STAR_GROWSPEED, STUN_STAR_MAXGROW } from "../settings/values";

export class StunAnimation {
	private readonly images: babylon.Mesh[] = [];
	private sceneObservable: babylon.Observable<babylon.Scene>;
	private sceneObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, texture: babylon.Texture, player: babylon.TransformNode) {
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene();
		this.images.push(this.createImage(scene, texture, player));
		this.images.push(this.createImage(scene, texture, player));
		this.images.push(this.createImage(scene, texture, player));
	}

	private createImage(scene: babylon.Scene, texture: babylon.Texture, player: babylon.TransformNode): babylon.Mesh {
		const plane = babylon.MeshBuilder.CreatePlane("emote", { size: 10 }, scene);
		plane.scaling.set(0.1, 0.1, 0.1);
		const material = new babylon.PBRMaterial("mat", scene);
		material.albedoTexture = texture.clone();
		material.albedoTexture.hasAlpha = true;
		material.unlit = true;
		plane.material = material;
		plane.billboardMode = babylon.Mesh.BILLBOARDMODE_ALL;
		plane.renderingGroupId = 1;
		plane.parent = player;
		return plane;
	}

	private observeScene(): babylon.Observer<babylon.Scene> {
		let grow = 0;
		let angle = 0;
		const radius = 1.5; // distance autour de la tête
		const sceneObserver = this.sceneObservable.add(() => {
			grow += STUN_STAR_GROWSPEED;
			angle += 0.1; // rotatio speed
			
			for (let i = 0; i < this.images.length; i++) {
				if (grow <= STUN_STAR_MAXGROW)
					this.images[i].scaling.set(0.1 * grow, 0.1 * grow, 0.1 * grow);

				const a = angle + (i * (Math.PI * 2 / this.images.length));
				const x = Math.cos(a) * radius;
				const z = Math.sin(a) * radius;

				this.images[i].position.set(x, PLAYER_DIMENSION.y + 2, z);
			};
		});
		return sceneObserver;
	}

	destroy(): void {
		this.sceneObservable.remove(this.sceneObserver);
		this.images.forEach(image => {
			image.material?.dispose();
			image.dispose();
		});
	}
}