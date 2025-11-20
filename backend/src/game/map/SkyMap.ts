import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Lightning } from "./map_utils/Lightning.js";
import { MAP_SIZE, LIGHTNING_INTERVAL, LIGHTNING_LIFETIME } from "../settings/values.js";
import { WebSocket } from "ws";

export class SkyMap extends MapTemplate {
	private readonly lightnings: Lightning[] = [];
	private readonly sockets: WebSocket[] = []; // one or two socket depening on the IA...
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		super(scene, "sky");
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene);
		sockets.forEach(socket => {
			this.sockets.push(socket);
		});
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("sky",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		ground.metadata = { type: "ground" };
		return ground;
	}

	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		let lightningTimer = 0;
		const sceneObserver = this.sceneObservable.add(() => {
			if (this.gameStopped)
				return;
			lightningTimer += scene.getEngine().getDeltaTime();
			if (lightningTimer >= LIGHTNING_INTERVAL) {
				lightningTimer -= LIGHTNING_INTERVAL;
				const lightning = new Lightning(scene, this.lightnings.length, this.sockets);
				this.lightnings.push(lightning);
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
		while (this.lightnings.length) {
			this.lightnings[0].destroy();
			this.lightnings.splice(0, 1);
		}
	}
}
