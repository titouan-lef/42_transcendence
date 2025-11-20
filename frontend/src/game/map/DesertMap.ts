import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Tornado } from "./map_utils/Tornado.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS3, W_PARTICLE_NUMBER, TORNADO_INTERVAL, TORNADO_LIFETIME, WIND_FORCE, W_GLOW_INTENSITY, COLORS4, START_TIMEOUT } from "../settings/values.js";
import { ObjectMessage } from "../types_transfert.js";

export class DesertMap extends MapTemplate {
	private readonly particles: babylon.ParticleSystem;
	private readonly tornados: Tornado[] = [];
	private readonly windForce: babylon.Vector3;

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>, windForce: babylon.Vector3) {
		super(scene, "desert");
		this.glow.intensity = W_GLOW_INTENSITY;
		this.windForce = windForce;
		this.particles = this.createParticles(scene, texture.flare);
		this.wallHighlight = new babylon.HighlightLayer("wallhighlight", scene);
		this.limits.forEach(limit => this.wallHighlight?.addMesh(limit, COLORS3.desertHighlightWall));
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("desertground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		ground.metadata = { type: "ground" };
		const material = new babylon.StandardMaterial("groundMat", scene);
		material.diffuseColor  = COLORS3.desertDiffuseGround;
		material.emissiveColor  = COLORS3.desertEmissiveGround;
		const noise = new babylon.NoiseProceduralTexture("groundNoise", 256, scene, undefined, false);
		noise.animationSpeedFactor = 0;
		noise.octaves = 4;
		noise.persistence = 0.6;
		noise.brightness = 0.5;
		material.diffuseTexture = noise;
		ground.material = material;
		return ground;
	}

	createSun(scene: babylon.Scene): babylon.Mesh {
		const sun = babylon.MeshBuilder.CreateSphere("sun", { diameter: SUN_DIAMETER }, scene);
		const sunMaterial = new babylon.StandardMaterial("sunMat", scene);
		sunMaterial.emissiveColor = COLORS3.desertEmissiveSun;
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
		light.intensity = 0.7;
		light.diffuse = COLORS3.desertDiffuseLight;
		return light;
	}

	private createParticles(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		scene.clearColor = COLORS4.desertSky;
		const particles = new babylon.ParticleSystem("wind", W_PARTICLE_NUMBER, scene);
		particles.particleTexture = texture;
		particles.emitter = new babylon.Vector3(0, 0, 0);
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_Y;
		particles.minEmitBox = new babylon.Vector3(-MAP_SIZE.x * 1.4, -MAP_SIZE.y * 1, -MAP_SIZE.z * 1.4);
		particles.maxEmitBox = new babylon.Vector3(MAP_SIZE.x * 1.4, MAP_SIZE.y * 2, MAP_SIZE.y * 1.4);
		particles.color1 = COLORS4.desertWind1;
		particles.color2 = COLORS4.desertWind2;
		particles.colorDead = COLORS4.desertWindDead;
		particles.emitRate = 1800;
		particles.renderingGroupId = 1;
		particles.minEmitPower = 35;
		particles.maxEmitPower = 45;
		particles.minSize = 0.25;
		particles.maxSize = 0.5;
		particles.direction1 = this.windForce;
		particles.direction2 = this.windForce;
		particles.minLifeTime = 1;
		particles.maxLifeTime = 2;
		particles.updateSpeed = 0.008;
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_Y;
		particles.start();
		return particles;
	}

	handleObject(scene: babylon.Scene, texture: Record<string, babylon.Texture>, tornado: ObjectMessage): void {
		if (this.gameStopped)
			return;
		if (tornado.id >= this.tornados?.length) {
			this.tornados?.push(new Tornado(scene, texture.flare, tornado.position, tornado.size));
		} else {
			if (tornado.currentLifetime === 0) {
				this.tornados?.at(tornado.id)?.destroy();
				return;
			}
			this.tornados?.at(tornado.id)?.updatePosition(tornado.position);
		}
	}

	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		const material = new babylon.StandardMaterial('wallcolor', scene);
		material.diffuseColor =  COLORS3.desertDiffuseWall;
		newMesh.material = material;
		return newMesh;
	}

	destroyRest(): void {
		while (this.tornados.length) {
			this.tornados[0].destroy();
			this.tornados.splice(0, 1);
		}
		this.particles?.stop();
		if (this.particles && this.particles.particleTexture)
			this.particles.particleTexture = null;
		this.particles?.dispose();
	}
}
