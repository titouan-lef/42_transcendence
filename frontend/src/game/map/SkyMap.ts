import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Lightning } from "./map_utils/Lightning.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS3, COLORS4, R_PARTICLE_NUMBER, LIGHTNING_INTERVAL, LIGHTNING_LIFETIME, R_GLOW_INTENSITY } from "../settings/values.js";
import { ObjectMessage } from "../types_transfert.js";

export class SkyMap extends MapTemplate {
	private readonly particles: babylon.ParticleSystem;
	private readonly lightnings: Lightning[] = [];

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "sky");
		this.glow.intensity = R_GLOW_INTENSITY;
		this.particles = this.createParticles(scene, texture.rain);
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("sky",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		ground.metadata = { type: "ground" };
		const material = new babylon.StandardMaterial("groundMat", scene);
		material.diffuseColor  = COLORS3.skyDiffuseGround;
		material.emissiveColor = COLORS3.skyEmissiveGround;
		const noise = new babylon.NoiseProceduralTexture("groundNoise", 256, scene, undefined, false);
		noise.animationSpeedFactor = 0.5;
		noise.octaves = 4;
		noise.persistence = 0.6;
		noise.brightness = 0.1;
		material.diffuseTexture = noise;
		ground.material = material;
		return ground;
	}

	createSun(scene: babylon.Scene): babylon.Mesh {
		const sun = babylon.MeshBuilder.CreateSphere("sun", { diameter: SUN_DIAMETER }, scene);
		const sunMaterial = new babylon.StandardMaterial("sunMat", scene);
		sunMaterial.emissiveColor = COLORS3.skyEmissiveSun;
		sun.material = sunMaterial;
		sun.position = this.sunPosition.clone();
		sun.position.z -= MAP_SIZE.z / 2;
		sun.position.y += 10;
		return sun;
	}

	createLight(scene: babylon.Scene): babylon.DirectionalLight {
		const directionCenter: babylon.Vector3 = babylon.Vector3.Zero().subtract(this.sun.position).normalize();
		const light: babylon.DirectionalLight = new babylon.DirectionalLight("sunLight", directionCenter, scene);
		light.position = this.sun.position;
		light.intensity = 1;
		light.diffuse = COLORS3.skyDiffuseLight;
		return light;
	}

	/** the rain */
	private createParticles(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		scene.clearColor = COLORS4.skyDiffuseSky;
		const particles = new babylon.ParticleSystem("rain", R_PARTICLE_NUMBER, scene);
		particles.particleTexture = texture;
		particles.emitter = new babylon.Vector3(0, 0, 0);
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_Y;
		particles.minEmitBox = new babylon.Vector3(-MAP_SIZE.x * 1.4, -MAP_SIZE.y * 1, -MAP_SIZE.z * 1.4);
		particles.maxEmitBox = new babylon.Vector3(MAP_SIZE.x * 1.4, MAP_SIZE.y * 2, MAP_SIZE.y * 1.4);
		particles.color1    = COLORS4.skyRain1;
		particles.color2    = COLORS4.skyRain2;
		particles.colorDead = COLORS4.skyRainDead;
		particles.emitRate = 1800;
		particles.renderingGroupId = 1;
		particles.minEmitPower = 35;
		particles.maxEmitPower = 45;
		particles.minSize = 1;
		particles.maxSize = 1;
		particles.minLifeTime = 1.1;
		particles.maxLifeTime = 1.3;
		particles.direction1 = new babylon.Vector3(0, -5, 0);
		particles.direction2 = new babylon.Vector3(0, -5, 0);
		particles.updateSpeed = 0.008;
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_Y;
		particles.start();
		return particles;
	}

	handleObject(scene: babylon.Scene, texture: Record<string, babylon.Texture>, lightning: ObjectMessage): void {
		if (this.gameStopped)
			return;
		if (lightning.id >= this.lightnings?.length) {
			this.lightnings?.push(new Lightning(scene, texture.electricity, lightning.position, lightning.size));
		} else {
			if (lightning.currentLifetime === 0) {
				this.lightnings?.at(lightning.id)?.destroy();
				return;
			}
			this.lightnings?.at(lightning.id)?.changeVisibility(lightning.currentLifetime);
		}
	}

	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		const material = new babylon.StandardMaterial('wallcolor', scene);
		material.diffuseColor = COLORS3.skyDiffuseWall;
		material.emissiveColor = COLORS3.skyEmissiveWall;
		material.alpha = 0.8;
		newMesh.material = material;
		return newMesh;
	}

	destroyRest(): void {
		while (this.lightnings.length) {
			this.lightnings[0].destroy();
			this.lightnings.splice(0, 1);
		}
		this.particles?.stop();
		if (this.particles && this.particles.particleTexture)
			this.particles.particleTexture = null;
		this.particles?.dispose();
	}
}
