import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS, R_PARTICLE_NUMBER } from "../values.js";

/**@todo this map is not configured dont mind the code */
export class RainyMap extends MapTemplate {
	private readonly particles: babylon.ParticleSystem;

	constructor(scene: babylon.Scene, texture: babylon.Texture) {
		super(scene, "rainy");
		this.particles = this.createParticles(scene, texture);
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
		scene.clearColor = new babylon.Color4(0, 0, 0, 1); // sky
		const particles = new babylon.ParticleSystem("rain", R_PARTICLE_NUMBER, scene);
		particles.particleTexture = texture;
		particles.emitter = new babylon.Vector3(0, 0, 0);
		particles.minEmitBox = new babylon.Vector3(-MAP_SIZE.x * 1.4, -MAP_SIZE.y * 1.4, -MAP_SIZE.z * 1.4);
		particles.maxEmitBox = new babylon.Vector3(MAP_SIZE.x * 1.4, MAP_SIZE.y * 1.4, MAP_SIZE.y * 1.4);
		particles.color1 = new babylon.Color4(1, 1, 1, 1);
		particles.colorDead = new babylon.Color4(0, 0, 0, 0);
		particles.emitRate = 50;
		particles.renderingGroupId = 0;
		particles.minSize = 2.0;
		particles.maxSize = 4.0;
		particles.start();
		return particles;
	}

	destroyRest(): void {
		this.particles.stop();
		this.particles.dispose(); // textures will be disposed at the end of the game
	}
}
