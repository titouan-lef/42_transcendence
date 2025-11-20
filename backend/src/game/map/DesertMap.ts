import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Tornado } from "./map_utils/Tornado.js";
import { MAP_SIZE, TORNADO_INTERVAL, TORNADO_LIFETIME, WIND_FORCE } from "../settings/values.js";
import { WebSocket } from "ws";

export class DesertMap extends MapTemplate {
	private readonly tornados: Tornado[] = [];
	private readonly windForce;
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly sockets: WebSocket[] = []; // one or two socket depening on the IA...

	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		super(scene, "desert");
		this.windForce = new babylon.Vector3(
			(Math.random() - 0.5) * WIND_FORCE,
			0,
			(Math.random() - 0.5) * WIND_FORCE
		);
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene);
		sockets.forEach(socket => {
			this.sockets.push(socket);
		});
	}

	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		let tornadoTimer = 0;
		const sceneObserver = this.sceneObservable.add(() => {
			if (this.gameStopped)
				return ;
			scene.meshes.forEach(mesh => {
				if (!mesh.physicsBody)
					return;
				mesh.physicsBody.applyForce(
					this.windForce,
					mesh.getAbsolutePosition()
				);
			});
			tornadoTimer += scene.getEngine().getDeltaTime();
			if (tornadoTimer >= TORNADO_INTERVAL) {
				tornadoTimer -= TORNADO_INTERVAL;
				const tornado = new Tornado(scene,this.tornados.length, this.windForce, this.sockets);
				this.tornados.push(tornado);
			}
			/**@todo DO NOT empty the array */
		});
		return sceneObserver;
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

	destroyRest(): void {
		while (this.tornados.length) {
			this.tornados[0].destroy();
			this.tornados.splice(0, 1);
		}
		this.sceneObservable.remove(this.sceneObserver);
	}
}
