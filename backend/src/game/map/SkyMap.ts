import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { MAP_SIZE, WIND_FORCE } from "../settings/values.js";
import { Object } from "../web_sockets/types_transfert.js";

class SkyMap extends MapTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "sky");
		this.availableObjects.push(Object.LIGHTNING);
		this.wind = {
			x: (Math.random() - 0.5) * WIND_FORCE,
			z: (Math.random() - 0.5) * WIND_FORCE
		};
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("sky",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		ground.metadata = { type: "ground" };
		return ground;
	}

	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		return newMesh;
	}

	destroyRest(): void {}
}

export { SkyMap };
