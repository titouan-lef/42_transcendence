import * as babylon from "@babylonjs/core";
import { Lightning } from "./Lightning.js";
import { Meteor } from "./Meteor.js";
import { Tornado } from "./Tornado.js";
import { PlanePosition } from "../../web_sockets/types_transfert.js";
import { LIGHTNING_INTERVAL, METEOR_INTERVAL, TORNADO_INTERVAL } from "../../settings/values.js";
import { planePosToVec3 } from "../../utils.js";
import { Object } from "../../web_sockets/types_transfert.js";
import { WebSocket } from "ws";

type Spawners = EnvironmentManager["lightningSpawner"] | EnvironmentManager["meteorSpawner"] | EnvironmentManager["tornadoSpawner"];

interface ObjectParameters {
	object: Object,
	timer: number,
	spawner: Spawners
}

export type ObjectType = Lightning | Meteor | Tornado;

class EnvironmentManager {
	private objectsParameters: ObjectParameters[] = [];
	private objects: ObjectType[] = [];
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly sockets: WebSocket[];
	private gameStopped = true;
	private wind: PlanePosition = { x: 0, z: 0 };

	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		this.sockets = sockets;
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene);
	}

	private chooseSpawner(object: Object): Spawners {
		switch (object) {
			case (Object.LIGHTNING):
				return this.lightningSpawner.bind(this);
			case (Object.METEOR):
				return this.meteorSpawner.bind(this);
			case (Object.TORNADO):
				return this.tornadoSpawner.bind(this);
			default:
				throw new Error("Invalid object type");
		}
	}

	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			if (this.gameStopped)
				return;
			scene.meshes.forEach(mesh => {
				if (!mesh.physicsBody || !mesh.metadata.windAffected)
					return;

				mesh.physicsBody.applyForce(
					planePosToVec3(this.wind),
					mesh.getAbsolutePosition()
				);
			});
			this.objectsParameters.forEach(object => {
				object.spawner(object, scene);
			});
		});
		return sceneObserver;
	}

	private meteorSpawner(object: ObjectParameters, scene: babylon.Scene): void {
		object.timer += scene.getEngine().getDeltaTime();
		if (object.timer >= METEOR_INTERVAL) {
			object.timer -= METEOR_INTERVAL;
			const meteor = new Meteor(scene, this.objects.length, this.sockets);
			this.objects.push(meteor);
		}
	}

	private lightningSpawner(object: ObjectParameters, scene: babylon.Scene): void {
		object.timer += scene.getEngine().getDeltaTime();
		if (object.timer >= LIGHTNING_INTERVAL) {
			object.timer -= LIGHTNING_INTERVAL;
			const lightning = new Lightning(scene, this.objects.length, this.sockets);
			this.objects.push(lightning);
		}
	}

	private tornadoSpawner(object: ObjectParameters, scene: babylon.Scene): void {
		object.timer += scene.getEngine().getDeltaTime();
		if (object.timer >= TORNADO_INTERVAL) {
			object.timer -= TORNADO_INTERVAL;
			const tornado = new Tornado(scene, this.objects.length, planePosToVec3(this.wind), this.sockets);
			this.objects.push(tornado);
		}
	}

	clearObjects(): void {
		while (this.objects.length) {
			this.objects[0].destroy();
			this.objects.splice(0, 1);
		}
	}

	startSpawn(): void {
		this.gameStopped = false;
	}

	pauseSpawn(): void {
		this.gameStopped = true;
	}

	initObjectsParameters(availableObjects: Object[], wind: PlanePosition): void {
		this.objectsParameters = [];
		availableObjects.forEach(object => {
			const newObject: ObjectParameters = {
				object: object,
				timer: 0,
				spawner: this.chooseSpawner(object)
			};
			this.objectsParameters.push(newObject);
		});
		this.wind = wind;
	}

	destroy(): void {
		this.sceneObservable.remove(this.sceneObserver);
		this.clearObjects();
	}
}

export { EnvironmentManager };
