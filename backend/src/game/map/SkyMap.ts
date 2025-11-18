import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Lightning } from "./map_utils/Lightning.js";
import { MAP_SIZE, LIGHTNING_INTERVAL, LIGHTNING_LIFETIME } from "../settings/values.js";
import { WebSocket } from "ws";

export class RainyMap extends MapTemplate {
	//private readonly lightningIntervalId: ReturnType<typeof setInterval>;
	private readonly lightnings: Lightning[] = [];
	private readonly sockets: WebSocket[] = []; // one or two socket depening on the IA...
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		super(scene, "sky");
		//this.lightningIntervalId = this.lightningInterval(scene);
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

	// private lightningInterval(scene: babylon.Scene): ReturnType<typeof setInterval> {
	// 	const lightningIntervalId = setInterval( () => {
	// 		if (this.gameStopped)
	// 			return;
	// 		const lightning = new Lightning(scene, this.lightnings.length, this.sockets);
	// 		this.lightnings.push(lightning); /** @todo is this realy necessary to stack them in the back ?? */
	// 		setTimeout(() => {
	// 			const index = this.lightnings?.indexOf(lightning);
	// 			if (index !== -1)
	// 				this.lightnings?.splice(index, 1);
	// 		}, LIGHTNING_LIFETIME + 100); /** @todo a bit of randomisation for liftime? */
	// 		lightning.sendObjectInfos();
	// 	}, LIGHTNING_INTERVAL); /** @todo a bit of randomisation? */
	// 	return lightningIntervalId;
	// }

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
		//clearInterval(this.lightningIntervalId);
		this.sceneObservable.remove(this.sceneObserver);
		while (this.lightnings.length) {
			this.lightnings[0].destroy();
			this.lightnings.splice(0, 1);
		}
	}
}
