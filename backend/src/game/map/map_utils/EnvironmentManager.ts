import * as babylon from "@babylonjs/core";
import { Lightning } from "./Lightning";
import { Meteor } from "./Meteor";
import { Tornado } from "./Tornado";
import { Object, PlanePosition } from "../../web_sockets/types_transfert";
import { LIGHTNING_INTERVAL, METEOR_INTERVAL, TORNADO_INTERVAL } from "../../settings/values";
import { planePosToVec3 } from "../../utils";
import { WebSocket } from "ws";

type Spawners = EnvironmentManager["lightningSpawner"] | EnvironmentManager["meteorSpawner"] | EnvironmentManager["tornadoSpawner"];

interface ObjectParameters {
	object: Object,
	timer: number,
	spawner: Spawners
}

type ObjectType = Lightning | Meteor | Tornado;

class EnvironmentManager {
	private readonly objectsParameters: ObjectParameters[];
	private objects: ObjectType[] = [];
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly sockets: WebSocket[];
	private gameStopped = true;
	private readonly wind: PlanePosition;

	constructor(availableObjects: Object[], scene: babylon.Scene, sockets: WebSocket[], wind: PlanePosition) {
		this.objectsParameters = this.initObjectsParameters(availableObjects);
		this.sockets = sockets;
		this.wind = wind;
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene);
	}

	private initObjectsParameters(availableObjects: Object[]): ObjectParameters[] {
		const objectsParameters: ObjectParameters[] = [];

		availableObjects.forEach(object => {
			const newObject: ObjectParameters = {
				object: object,
				timer: 0,
				spawner: this.chooseSpawner(object)
			};
			objectsParameters.push(newObject);
		});

		return objectsParameters;
	}

	private chooseSpawner(object: Object): Spawners {
		if (object === 0)
			return this.lightningSpawner.bind(this);
		else if (object === 1)
			return this.meteorSpawner.bind(this);
		else if (object === 2)
			return this.tornadoSpawner.bind(this);
		throw new Error("Invalid object type");
	}

	startSpawn(): void {
		this.gameStopped = false;
	}

	pauseSpawn(): void {
		this.gameStopped = true;
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
				object.spawner(object.timer, scene);
			});
		});
		return sceneObserver;
	}

	private meteorSpawner(timer: number, scene: babylon.Scene): void {
		timer += scene.getEngine().getDeltaTime();
		if (timer >= METEOR_INTERVAL) {
			timer -= METEOR_INTERVAL;
			const meteor = new Meteor(scene, this.objects.length, this.sockets);
			this.objects.push(meteor);
		}
	}

	private lightningSpawner(timer: number, scene: babylon.Scene): void {
		timer += scene.getEngine().getDeltaTime();
		if (timer >= LIGHTNING_INTERVAL) {
			timer -= LIGHTNING_INTERVAL;
			const lightning = new Lightning(scene, this.objects.length, this.sockets);
			this.objects.push(lightning);
		}
	}

	private tornadoSpawner(timer: number, scene: babylon.Scene): void {
		timer += scene.getEngine().getDeltaTime();
		if (timer >= TORNADO_INTERVAL) {
			timer -= TORNADO_INTERVAL;
			const tornado = new Tornado(scene, this.objects.length, planePosToVec3(this.wind), this.sockets);
			this.objects.push(tornado);
		}
	}

	destroy(): void {
		this.sceneObservable.remove(this.sceneObserver);
		while (this.objects.length) {
			this.objects[0].destroy();
			this.objects.splice(0, 1);
		}
	}
}

export { EnvironmentManager };