import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Meteor } from "./map_utils/Meteor.js";
import { MAP_SIZE, METEOR_INTERVAL, METEOR_LIFETIME } from "../settings/values.js";
import { WebSocket } from "ws";

export class VolcanoMap extends MapTemplate {
	private readonly meteors: Meteor[] = [];
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly sockets: WebSocket[] = []; // one or two socket depening on the IA...

	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		super(scene, "volcano");
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene);
		sockets.forEach(socket => {
			this.sockets.push(socket);
		});
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("volcanoground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		ground.metadata = { type: "ground" };
		return ground;
	}

	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		let meteorTimer = 0;
		const sceneObserver = this.sceneObservable.add(() => {
			if (this.gameStopped)
				return;
			meteorTimer += scene.getEngine().getDeltaTime();
			if (meteorTimer >= METEOR_INTERVAL) {
				meteorTimer -= METEOR_INTERVAL;
				const meteor = new Meteor(scene, this.meteors.length, this.sockets);
				this.meteors.push(meteor);
			}
			/**@todo DO NOT empty the array */
		});
		return sceneObserver;
	}

	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		return newMesh;
	}

	destroyRest(): void {
		this.sceneObservable.remove(this.sceneObserver);
		while (this.meteors.length) {
			this.meteors[0].destroy();
			this.meteors.splice(0, 1);
		}
	}
}
