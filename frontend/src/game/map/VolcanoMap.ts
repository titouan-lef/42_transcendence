import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Meteor } from "./map_utils/Meteor.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS, METEOR_INTERVAL, METEOR_LIFETIME } from "../values.js";

/**@todo this map is not configured dont mind the code */
export class VolcanoMap extends MapTemplate {
	private readonly meteors: Meteor[] = [];
	private readonly meteorIntervalId: ReturnType<typeof setInterval>;

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "volcano");
		this.meteorIntervalId = this.meteorInterval(scene, texture);
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("volcanoground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		ground.metadata = { type: "ground" };
		const material = new babylon.StandardMaterial("ground",scene);
		material.emissiveColor = COLORS.groundColorVolcano;
		const noise = new babylon.NoiseProceduralTexture("groundNoise", 256, scene);
		noise.animationSpeedFactor = 0;
		noise.octaves = 4;
		noise.persistence = 0.6;
		noise.brightness = 0.3;
		material.diffuseTexture = noise;
		ground.material = material;
		return ground;
	}

	createSun(scene: babylon.Scene): babylon.Mesh {
		const sun = babylon.MeshBuilder.CreateSphere("sun", { diameter: SUN_DIAMETER }, scene);
		const sunMaterial = new babylon.StandardMaterial("sunMat", scene);
		sunMaterial.emissiveColor = COLORS.orange;
		sun.material = sunMaterial;
		sun.position = this.score.absolutePosition.clone();
		sun.position.z -= MAP_SIZE.z / 2;
		sun.position.y += 10;
		return sun;
	}

	createLight(scene: babylon.Scene): babylon.DirectionalLight {
		const directionCenter: babylon.Vector3 = babylon.Vector3.Zero().subtract(this.sun.position).normalize();
		const light: babylon.DirectionalLight = new babylon.DirectionalLight("sunLight", directionCenter, scene);
		light.position = this.sun.position;
		light.intensity = 1;
		light.diffuse = COLORS.lightColorVolcano;
		return light;
	}

	private meteorInterval(scene: babylon.Scene, texture: Record<string, babylon.Texture>): ReturnType<typeof setInterval> {
		const meteorIntervalId = setInterval( () => {
			const meteor = new Meteor(scene, texture);
			this.meteors.push(meteor);
			if (this.activateInterval === false)
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
		const material = new babylon.StandardMaterial('wallcolor', scene);
		material.diffuseColor =  COLORS.lime;
		newMesh.material = material;
		return newMesh;
	}

	destroyRest(): void {
		if (this.meteorIntervalId)
			clearInterval(this.meteorIntervalId);
		while (this.meteors.length) {
			this.meteors[0].destroy();
			this.meteors.splice(0, 1);
		}
	}
}
