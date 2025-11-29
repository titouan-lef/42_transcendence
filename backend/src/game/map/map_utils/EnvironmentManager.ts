import * as babylon from "@babylonjs/core";
import { Lightning } from "./Lightning.js";
import { Meteor } from "./Meteor.js";
import { Tornado } from "./Tornado.js";
import { PlanePosition } from "../../web_sockets/types_transfert.js";
import { BALL_DIAMETER, CANON_BALL_INTERVAL, LIGHTNING_INTERVAL, MAP_SIZE, METEOR_INTERVAL, TORNADO_INTERVAL, WALL_WIDTH } from "../../settings/values.js";
import { planePosToVec3 } from "../../utils.js";
import { Object } from "../../web_sockets/types_transfert.js";
import { GameSettings } from "../../settings/GameSettings.js";
import { WebSocket } from "ws";
import { CanonBall } from "./CanonBall.js";

type Spawners = EnvironmentManager["lightningSpawner"] | EnvironmentManager["meteorSpawner"] | EnvironmentManager["tornadoSpawner"] | EnvironmentManager["canonBallSpawner"];

interface ObjectParameters {
	object: Object,
	timer: number,
	spawner: Spawners
}

export type ObjectType = Lightning | Meteor | Tornado | CanonBall;

class EnvironmentManager {
	private objectsParameters: ObjectParameters[] = [];
	private objects: ObjectType[] = [];
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

	private chooseSpawner(object: Object): Spawners {
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
		object.timer += scene.metadata.gameSpeed;
		if (object.timer >= CANON_BALL_INTERVAL) {
			object.timer -= CANON_BALL_INTERVAL;
			object.timer += Math.min(Math.random(), 0.8) * CANON_BALL_INTERVAL; // add randomness, can now spawn between CANON_BALL_INTERVAL and CANON_BALL_INTERVAL * 0.2;
			const canonBall = new CanonBall(scene, this.objects.length, this.sockets, this.settings);
			const randomSide = Math.random() < 0.5 ? 1 : -1;
			const posX = Math.min(Math.max(-MAP_SIZE.x / 2 * 0.2, Math.random() * MAP_SIZE.x / 2), MAP_SIZE.x / 2 * 0.8);
			let posZ = MAP_SIZE.z / 2 - WALL_WIDTH - BALL_DIAMETER;
			posZ *= randomSide;
			canonBall.setPosition(new babylon.Vector3(posX, BALL_DIAMETER / 2, posZ));
			const startingDirectionX = (Math.random() - 0.5) * 2;
			const startingDirectionZ = Math.random() * -randomSide;
			canonBall.launchBall(undefined, new babylon.Vector3(startingDirectionX, 0, startingDirectionZ).normalize());
			this.objects.push(canonBall);
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
