import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Tornado } from "./map_utils/Tornado.js";
import { MAP_SIZE, TORNADO_INTERVAL, WIND_FORCE } from "../settings/values.js";
import { WebSocket } from "ws";
import { planePosToVec3 } from "../utils.js";
import { Object } from "../web_sockets/types_transfert.js";

class DesertMap extends MapTemplate {
	constructor(scene: babylon.Scene) {
		super(scene, "desert");
		this.availableObjects.push(Object.TORNADO);
		this.wind = {
			x: (Math.random() - 0.5) * WIND_FORCE,
			z: (Math.random() - 0.5) * WIND_FORCE
		};
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("desertground",
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

export { DesertMap };
