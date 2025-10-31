import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Lightning } from "./Lightning.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS, R_PARTICLE_NUMBER, LIGHTNING_INTERVAL } from "../values.js";

/**@todo this map is not configured dont mind the code */
export class RainyMap extends MapTemplate {
	private readonly particles: babylon.ParticleSystem;
	private readonly lightningIntervalId: ReturnType<typeof setInterval>;
	private readonly lightnings: Lightning[] = [];

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "rainy");
		this.particles = this.createParticles(scene, texture.rain);
		this.lightningIntervalId = this.lightningInterval(scene, texture.flare);
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("rainyground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		return ground;
	}

	/**@todo to configure */
	createSun(scene: babylon.Scene): babylon.Mesh {
		const sun = babylon.MeshBuilder.CreateSphere("sun", { diameter: SUN_DIAMETER }, scene);
		const sunMaterial = new babylon.StandardMaterial("sunMat", scene);
		sunMaterial.emissiveColor = COLORS.grey;
		sun.material = sunMaterial;
		sun.position = new babylon.Vector3(-(MAP_SIZE.x / 2), MAP_SIZE.y * 0.7, -(MAP_SIZE.z / 2));
		return sun;
	}

	createLight(scene: babylon.Scene): babylon.DirectionalLight {
		const directionCenter: babylon.Vector3 = babylon.Vector3.Zero().subtract(this.sun.position).normalize();
		const light: babylon.DirectionalLight = new babylon.DirectionalLight("sunLight", directionCenter, scene);
		light.position = this.sun.position;
		light.intensity = 1;
		light.diffuse = COLORS.grey;
		return light;
	}

	/** the stars in the background, will maybe move to abstract in template depending of the other maps's design */
	private createParticles(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		scene.clearColor = new babylon.Color4(0.5, 0.5, 0.5, 1); // sky
		const particles = new babylon.ParticleSystem("rain", R_PARTICLE_NUMBER, scene);
		particles.particleTexture = texture.clone();
		particles.emitter = new babylon.Vector3(0, 0, 0);
		particles.minEmitBox = new babylon.Vector3(-MAP_SIZE.x * 1.4, -MAP_SIZE.y * 1, -MAP_SIZE.z * 1.4);
		particles.maxEmitBox = new babylon.Vector3(MAP_SIZE.x * 1.4, MAP_SIZE.y * 2, MAP_SIZE.y * 1.4);
		particles.color1 = new babylon.Color4(0.85, 0.9, 1.0, 0.85);
		particles.color2 = new babylon.Color4(0.85, 0.9, 1.0, 0.65);
		particles.colorDead = new babylon.Color4(0.85, 0.9, 1.0, 0.0);
		particles.emitRate = 1800;
		particles.renderingGroupId = 2; //
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

		// (Optionnel) Légère turbulence avec une NoiseProceduralTexture
		// const noiseTex = new BABYLON.NoiseProceduralTexture("rainNoise", 128, scene);
		// noiseTex.animationSpeedFactor = 2.0;
		// noiseTex.persistence = 0.6;
		// noiseTex.brightness = 0.2;
		// rain.noiseTexture = noiseTex;
		// rain.noiseStrength = new BABYLON.Vector3(1.5, 0, 1.5);

		particles.start();
		return particles;
	}

	private lightningInterval(scene: babylon.Scene, texture: babylon.Texture): ReturnType<typeof setInterval> {
		const lightningIntervalId = setInterval( () => {
			this.lightnings.push(new Lightning(scene, texture));
			if (this.activateInterval === false)
				clearInterval(this.lightningIntervalId);
		}, LIGHTNING_INTERVAL);
		return lightningIntervalId;
	}

	destroyRest(): void {
		if (this.lightningIntervalId)
			clearInterval(this.lightningIntervalId);
		while (this.lightnings.length) {
			this.lightnings[0].destroy();
			this.lightnings.splice(0, 1);
		}
		this.particles.stop();
		this.particles.dispose(); // textures will be disposed at the end of the game
	}
}
