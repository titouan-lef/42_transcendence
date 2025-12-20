import * as babylon from "@babylonjs/core";
import { Lightning } from "./Lightning.js";
import { Meteor } from "./Meteor.js";
import { Tornado } from "./Tornado.js";
import { CANON_BALL_INTERVAL, CANON_MAX_COUNT, LIGHTNING_INTERVAL, METEOR_INTERVAL, TORNADO_INTERVAL } from "../../settings/values.js";
import { planePosToVec3 } from "../../utils.js";
import { PlanePosition, Object } from "#shared/types_transfert.js";
import { GameSettings } from "../../settings/GameSettings.js";
import { WebSocket } from "ws";
import { CanonBall } from "./CanonBall.js";
import { Canon } from "./Canon.js";

type Spawners = EnvironmentManager["lightningSpawner"] | EnvironmentManager["meteorSpawner"] | EnvironmentManager["tornadoSpawner"] | EnvironmentManager["canonBallSpawner"];
type ObjectType = Lightning | Meteor | Tornado | CanonBall;
type ObjectSpawnerType = Canon;

interface ObjectParameters {
	object: Object,
	timer: number,
	spawnFunction: Spawners,
	spawner?: ObjectSpawnerType
}

class EnvironmentManager {
	private objectsParameters: ObjectParameters[] = [];
	private readonly objects: ObjectType[] = [];
	private readonly objectSpawners: ObjectSpawnerType[] = [];
	private canoncurrentCount = 0;
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly sockets: WebSocket[];
	private readonly settings: GameSettings;
	private gameStopped = true;
	private wind: PlanePosition = { x: 0, z: 0 };

	constructor(scene: babylon.Scene, sockets: WebSocket[], settings: GameSettings) {
		this.sockets = sockets;
		this.settings = settings;
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene);
	}

	private chooseSpawnerFunction(object: Object): Spawners {
		switch (object) {
			case (Object.LIGHTNING):
				return this.lightningSpawner.bind(this);
			case (Object.METEOR):
				return this.meteorSpawner.bind(this);
			case (Object.TORNADO):
				return this.tornadoSpawner.bind(this);
			case (Object.CANON_BALL):
				return this.canonBallSpawner.bind(this);
			default:
				throw new Error("Invalid object type");
		}
	}

	private chooseSpawner(scene: babylon.Scene, object: Object): ObjectSpawnerType | undefined {
		switch (object) {
			case (Object.CANON_BALL):
				this.canoncurrentCount++;
				const side = this.canoncurrentCount % 2 ? "right" : "left";
				const newCanon = new Canon(scene, this.objectSpawners.length, this.sockets, side);
				this.objectSpawners.push(newCanon);
				return newCanon;
			default:
				return undefined;
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
				object.spawnFunction(object, scene);
			});
		});
		return sceneObserver;
	}

	private meteorSpawner(object: ObjectParameters, scene: babylon.Scene): void {
		object.timer += scene.metadata.gameSpeed;
		if (object.timer >= METEOR_INTERVAL) {
			object.timer -= METEOR_INTERVAL;
			object.timer += Math.min(Math.random(), 0.8) * METEOR_INTERVAL; // add randomness, can now spawn between METEOR_INTERVAL and METEOR_INTERVAL * 0.2;
			const meteor = new Meteor(scene, this.objects.length, this.sockets);
			this.objects.push(meteor);
		}
	}

	private lightningSpawner(object: ObjectParameters, scene: babylon.Scene): void {
		object.timer += scene.metadata.gameSpeed;
		if (object.timer >= LIGHTNING_INTERVAL) {
			object.timer -= LIGHTNING_INTERVAL;
			object.timer += Math.min(Math.random(), 0.8) * LIGHTNING_INTERVAL; // add randomness, can now spawn between LIGHTNING_INTERVAL and LIGHTNING_INTERVAL * 0.2;
			const lightning = new Lightning(scene, this.objects.length, this.sockets);
			this.objects.push(lightning);
		}
	}

	private tornadoSpawner(object: ObjectParameters, scene: babylon.Scene): void {
		object.timer += scene.metadata.gameSpeed;
		if (object.timer >= TORNADO_INTERVAL) {
			object.timer -= TORNADO_INTERVAL;
			object.timer += Math.min(Math.random(), 0.8) * TORNADO_INTERVAL; // add randomness, can now spawn between TORNADO_INTERVAL and TORNADO_INTERVAL * 0.2;
			const tornado = new Tornado(scene, this.objects.length, planePosToVec3(this.wind), this.sockets);
			this.objects.push(tornado);
		}
	}

	private canonBallSpawner(object: ObjectParameters, scene: babylon.Scene): void {
		if (!object.spawner)
			return ;
		object.timer += scene.metadata.gameSpeed;
		if (object.timer >= CANON_BALL_INTERVAL) {
			object.timer -= CANON_BALL_INTERVAL;
			const spawnPos = object.spawner.getCanonTip();
			if (!spawnPos)
				return;
			const canonBall = new CanonBall(scene, this.objects.length, this.sockets, this.settings, object.spawner.getStun());
			canonBall.setPosition(spawnPos.clone());
			const direction = spawnPos.subtract(object.spawner?.getPosition()).normalize();
			canonBall.launchBall(undefined, direction);
			this.objects.push(canonBall);
		}
	}

	clearObjects(): void {
		while (this.objects.length) {
			this.objects[0].destroy();
			this.objects.splice(0, 1);
		}
		while (this.objectSpawners.length) {
			this.objectSpawners[0].destroy();
			this.objectSpawners.splice(0, 1);
		}
		this.objectsParameters = [];
		this.canoncurrentCount = 0;
	}

	startSpawn(): void {
		this.gameStopped = false;
	}

	pauseSpawn(): void {
		this.gameStopped = true;
	}

	private parseAvailableObjects(availableObjects: Object[]): Object[] {
		const parsedAvailableObjects: Object[] = [];
		let canonCount = this.canoncurrentCount;
		availableObjects.forEach(object => {
			if (object === Object.CANON_BALL && canonCount === CANON_MAX_COUNT)
				return ;
			if (object === Object.CANON_BALL)
				canonCount++;
			parsedAvailableObjects.push(object);
		});
		return parsedAvailableObjects;
	}

	initObjectsParameters(scene: babylon.Scene, availableObjects: Object[], wind: PlanePosition): void {
		const parsedAvailableObjects = this.parseAvailableObjects(availableObjects);
		parsedAvailableObjects.forEach(object => {
			const newObject: ObjectParameters = {
				object: object,
				timer: 0,
				spawnFunction: this.chooseSpawnerFunction(object),
				spawner: this.chooseSpawner(scene, object)
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

export { EnvironmentManager, ObjectSpawnerType };
