import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Meteor } from "./map_utils/Meteor.js";
import { MAP_SIZE, METEOR_INTERVAL, METEOR_LIFETIME } from "../settings/values.js";
import { WebSocket } from "ws";

export class VolcanoMap extends MapTemplate {
	private readonly meteors: Meteor[] = [];
	private readonly meteorIntervalId: ReturnType<typeof setInterval>;
	private readonly sockets: WebSocket[] = []; // one or two socket depening on the IA...
	// private readonly particles: babylon.ParticleSystem;

	constructor(scene: babylon.Scene, sockets: WebSocket[]) {
		super(scene, "volcano");
		// this.glow.intensity = V_GLOW_INTENSITY;
		// this.particles = this.createParticles(scene, texture.flare);
		this.meteorIntervalId = this.meteorInterval(scene);
		// this.wallHighlight = new babylon.HighlightLayer("wallhighlight", scene);
		// this.highlightTimeout = setTimeout(() => {
		// 	this.limits.forEach(limit => this.wallHighlight?.addMesh(limit, COLORS3.volcanoHighlightWall));
		// }, START_TIMEOUT);
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

	private meteorInterval(scene: babylon.Scene): ReturnType<typeof setInterval> {
		const meteorIntervalId = setInterval( () => {
			if (this.gameStopped)
				return;
			const meteor = new Meteor(scene, this.meteors.length, this.sockets);
			this.meteors.push(meteor);
			if (this.gameStopped)
				clearInterval(this.meteorIntervalId);
			setTimeout(() => {
				const index = this.meteors?.indexOf(meteor);
				if (index !== -1)
					this.meteors?.splice(index, 1);
			}, METEOR_LIFETIME + 2000);
		}, METEOR_INTERVAL);
		return meteorIntervalId;
	}

	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		// const material = new babylon.StandardMaterial('wallcolor', scene);
		// material.diffuseColor =  COLORS3.volcanoDiffuseWall;
		// newMesh.material = material;
		return newMesh;
	}

	destroyRest(): void {
		if (this.meteorIntervalId)
			clearInterval(this.meteorIntervalId);
		while (this.meteors.length) {
			this.meteors[0].destroy();
			this.meteors.splice(0, 1);
		}
		// this.particles?.stop();
		// if (this.particles && this.particles.particleTexture)
		// 	this.particles.particleTexture = null;
		// this.particles?.dispose();
	}
}
