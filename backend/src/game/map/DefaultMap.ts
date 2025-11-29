import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { MAP_SIZE } from "../settings/values.js";
import { Object } from "../web_sockets/types_transfert.js";

class DefaultMap extends MapTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "default");
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("defaultground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		this.availableObjects.push(Object.CANON_BALL);
		ground.metadata = { type: "ground" };
		return ground;
	}

	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		return newMesh;
	}

	destroyRest(): void {}
}

export { DefaultMap };
