import * as babylon from "@babylonjs/core";
import { Lightning } from "./Lightning.js";
import { Meteor } from "./Meteor.js";
import { Tornado } from "./Tornado.js";
import { ObjectMessage } from "../../types_transfert.js";

type ObjectType = Lightning | Meteor | Tornado;

class EnvironmentManager {
	private readonly objects: ObjectType[] = [];

	handleObject(scene: babylon.Scene, textures: Record<string, babylon.Texture>, object: ObjectMessage): void {
		if (object.type === 0)
			this.handleLightning(scene, textures, object);
		if (object.type === 1)
			this.handleMeteor(scene, textures, object);
		if (object.type === 2)
			this.handleTornado(scene, textures, object);
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

	destroy(): void {
		while (this.objects.length) {
			this.objects[0].destroy();
			this.objects.splice(0, 1);
		}
	}
}

export { EnvironmentManager };