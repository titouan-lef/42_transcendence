import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { MAP_SIZE } from "../settings/values.js";
import { Object } from "../web_sockets/types_transfert.js";

class VolcanoMap extends MapTemplate {
	constructor(scene: babylon.Scene, canonCount: number) {
		super(scene, "volcano", canonCount);
		this.availableObjects.push(Object.METEOR);
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("volcanoground",
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

export { VolcanoMap };