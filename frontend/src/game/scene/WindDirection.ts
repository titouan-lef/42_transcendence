import * as babylon from "@babylonjs/core";
import { PlanePosition } from "../types_transfert";

class WindDirection {
	private image: babylon.Mesh;

	constructor(scene: babylon.Scene, wind: PlanePosition, texture: babylon.Texture) {
		this.image = babylon.MeshBuilder.CreatePlane("wind", { size: 10, sideOrientation: babylon.Mesh.DOUBLESIDE }, scene);
		this.image.rotation.x = Math.PI / 2;
		this.image.position.y = 0.1;
		this.image.renderingGroupId = 1;
		this.setMaterial(scene, texture);
		const angle = Math.atan2(wind.x, wind.z) + Math.PI * -0.24;
		this.image.rotation.y = angle;
	}

	private setMaterial(scene: babylon.Scene, texture: babylon.Texture): void {
		const material = new babylon.PBRMaterial("mat", scene);
		material.albedoTexture = texture.clone();
		material.albedoTexture.hasAlpha = true;
		material.unlit = true;
		this.image.material = material;
	}

	destroy(): void {
		this.image.material?.dispose();
		this.image.dispose();
	}
}

export { WindDirection };