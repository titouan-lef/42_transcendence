import * as babylon from "@babylonjs/core";
import { Lightning } from "./Lightning.js";
import { Meteor } from "./Meteor.js";
import { Tornado } from "./Tornado.js";
import { ObjectMessage, Object, ObjectSpawnerMessage, ObjectSpawner } from "../../types_transfert.js";
import { Ball } from "../../ball/Ball.js";
import { COLORS3 } from "../../settings/values.js";
import { Canon } from "./Canon.js";

type ObjectType = Lightning | Meteor | Tornado | Ball;

type ObjectSpawnersType = Canon;

class EnvironmentManager {
	private readonly objects: ObjectType[] = [];
	private readonly objectSpawners: ObjectSpawnersType[] = [];

	handleObject(scene: babylon.Scene, textures: Record<string, babylon.Texture>, object: ObjectMessage): void {
		if (object.type === Object.LIGHTNING)
			this.handleLightning(scene, textures, object);
		if (object.type === Object.METEOR)
			this.handleMeteor(scene, textures, object);
		if (object.type === Object.TORNADO)
			this.handleTornado(scene, textures, object);
		if (object.type === Object.CANON_BALL)
			this.handleCanonBall(scene, object);
	}

	handleObjectSpawner(scene: babylon.Scene, object: ObjectSpawnerMessage): void {
		if (object.type === ObjectSpawner.CANON)
			this.handleCanon(scene, object);
	}

	private handleLightning(scene: babylon.Scene, textures: Record<string, babylon.Texture>, lightning: ObjectMessage): void {
		if (lightning.id >= this.objects?.length) {
			this.objects?.push(new Lightning(scene, textures.electricity, lightning.position, lightning.size));
		} else {
			const currentLightning = this.objects?.at(lightning.id);
			if (!(currentLightning instanceof Lightning))
				return ;
			if (lightning.currentLifetime === 0)
				currentLightning?.destroy();
			else
				currentLightning?.changeVisibility(lightning.currentLifetime);
		}
	}

	private handleMeteor(scene: babylon.Scene, textures: Record<string, babylon.Texture>, meteor: ObjectMessage): void {
		if (meteor.id >= this.objects?.length) {
			this.objects?.push(new Meteor(scene, textures, meteor.position, meteor.size));
		} else {
			const currentMeteor = this.objects?.at(meteor.id);
			if (!(currentMeteor instanceof Meteor))
				return;
			if (meteor.currentLifetime === 0)
				currentMeteor.destroy();
			else
				currentMeteor.updatePosition(meteor.position);
		}
	}

	private handleTornado(scene: babylon.Scene, textures: Record<string, babylon.Texture>, tornado: ObjectMessage): void {
		if (tornado.id >= this.objects?.length) {
			this.objects?.push(new Tornado(scene, textures.flare, tornado.position, tornado.size));
		} else {
			const currentTornado = this.objects?.at(tornado.id);
			if (!(currentTornado instanceof Tornado))
				return ;
			if (tornado.currentLifetime === 0)
				currentTornado.destroy();
			else
				currentTornado.updatePosition(tornado.position);
		}
	}

	private handleCanonBall(scene: babylon.Scene, canonBall: ObjectMessage): void {
		if (canonBall.id >= this.objects?.length) {
			const newBall = new Ball(scene, "default", COLORS3.grey);
			newBall.setPosition(canonBall.position);
			this.objects?.push(newBall);
		} else {
			const currentCanonBall = this.objects?.at(canonBall.id);
			if (!(currentCanonBall instanceof Ball))
				return ;
			if (canonBall.currentLifetime === 0) 
				currentCanonBall.destroy();
			else
				currentCanonBall.setPosition(canonBall.position);
		}
	}

	private handleCanon(scene: babylon.Scene, canon: ObjectSpawnerMessage): void {
		if (canon.id >= this.objectSpawners?.length) {
			this.objectSpawners?.push(new Canon(scene, canon.id, canon.stun));
		} else {
			const currentCanon = this.objectSpawners?.at(canon.id);
			if (!(currentCanon instanceof Canon))
				return ;
			if (canon.currentLifetime === 0)
				currentCanon.destroy();
			else 
				currentCanon.update(scene, canon);
		}
	}

	clear(): void {
		while (this.objects.length) {
			this.objects[0].destroy();
			this.objects.splice(0, 1);
		}
		while (this.objectSpawners.length) {
			this.objectSpawners[0].destroy();
			this.objectSpawners.splice(0, 1);
		}
	}
}

export { EnvironmentManager };