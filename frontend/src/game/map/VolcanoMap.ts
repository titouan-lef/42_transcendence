import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS3, COLORS4, V_PARTICLE_NUMBER, V_GLOW_INTENSITY } from "../settings/values.js";
import { PlanePosition } from "../types_transfert.js";

class VolcanoMap extends MapTemplate {
	private readonly particles: babylon.ParticleSystem;

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>, wind: PlanePosition) {
		super(scene, "volcano", wind);
		this.glow.intensity = V_GLOW_INTENSITY;
		this.particles = this.createParticles(scene, texture.flare);
		this.wallHighlight = new babylon.HighlightLayer("wallhighlight", scene);
		this.limits.forEach(limit => this.wallHighlight?.addMesh(limit, COLORS3.volcanoHighlightWall));
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("volcanoground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		const material = new babylon.StandardMaterial("ground",scene);
		material.diffuseColor = COLORS3.volcanoDiffuseGround;
		material.emissiveColor = COLORS3.volcanoEmissiveGround;
		const noise = new babylon.NoiseProceduralTexture("groundNoise", 256, scene, undefined, false);
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
		sunMaterial.emissiveColor = COLORS3.volcanoEmissiveSun;
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
		light.diffuse = COLORS3.volcanoDiffuseLight;
		return light;
	}

	/** the ashes */
	private createParticles(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		scene.clearColor = COLORS4.volcanoDiffuseSky;
		const particles = new babylon.ParticleSystem("ashes", V_PARTICLE_NUMBER, scene);
		particles.particleTexture = texture.clone();
		particles.emitter = new babylon.Vector3(0, 0, 0);
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_Y;
		particles.minEmitBox = new babylon.Vector3(-MAP_SIZE.x * 1.4, -MAP_SIZE.y * 1, -MAP_SIZE.z * 1.4);
		particles.maxEmitBox = new babylon.Vector3(MAP_SIZE.x * 1.4, MAP_SIZE.y * 2, MAP_SIZE.y * 1.4);
		particles.color1 = COLORS4.volcanoDiffuseAsh1;
		particles.color2 = COLORS4.volcanoDiffuseAsh2;
		particles.colorDead = COLORS4.volcanoDiffuseAshDead;
		particles.emitRate = 1800;
		particles.renderingGroupId = 1;
		particles.minEmitPower = 35;
		particles.maxEmitPower = 45;
		particles.minSize = 0.2;
		particles.maxSize = 0.3;
		particles.minLifeTime = 1.1;
		particles.maxLifeTime = 1.3;
		particles.direction1 = new babylon.Vector3(0, 0.3, 0);
		particles.direction2 = new babylon.Vector3(0, 0.3, 0);
		particles.updateSpeed = 0.005;
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_Y;
		particles.start();
		return particles;
	}

	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		const material = new babylon.StandardMaterial('wallcolor', scene);
		material.diffuseColor =  COLORS3.volcanoDiffuseWall;
		newMesh.material = material;
		return newMesh;
	}

	destroyRest(): void {
		this.particles?.stop();
		if (this.particles && this.particles.particleTexture)
			this.particles.particleTexture = null;
		this.particles?.dispose();
	}
}

export { VolcanoMap };