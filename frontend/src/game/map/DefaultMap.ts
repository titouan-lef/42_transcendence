import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { MAP_SIZE, SUN_DIAMETER, WALL_WIDTH, D_PARTICLE_NUMBER, COLORS } from "../values.js";

export class DefaultMap extends MapTemplate {
	private readonly bars: babylon.Mesh[];
	private readonly particles: babylon.ParticleSystem;
	private readonly wallHighlight: babylon.HighlightLayer;

	constructor(scene: babylon.Scene, texture: babylon.Texture) {
		super(scene, "default");
		this.bars = this.createBars(scene);
		this.particles = this.createParticles(scene, texture);
		this.wallHighlight = new babylon.HighlightLayer("wallhighlight", scene);
		this.limits.forEach(limit => this.wallHighlight.addMesh(limit, COLORS.red));
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("defaultground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		const material = new babylon.StandardMaterial('groundcolor', scene);
		material.diffuseColor =  COLORS.black;
		ground.material = material;
		return ground;
	}

	/** These are the things that delimit the sides of each map, only on the default map for now */
	private createBars(scene: babylon.Scene): babylon.Mesh[] {
		const bars: babylon.Mesh[] = [];
		let bar: babylon.Mesh;
		let startPositionZ = -MAP_SIZE.z / 2 + WALL_WIDTH;
		const endPositionZ = MAP_SIZE.z / 2 - WALL_WIDTH;
		const steps = 3;
		for (startPositionZ; startPositionZ < endPositionZ;) {
			bar = babylon.CreateBox("bar", { width: 0.5, height: 0.1, depth: steps }, scene);
			bar.position = new babylon.Vector3(0, 0, startPositionZ);
			startPositionZ += steps * 2;
			const mat = new babylon.StandardMaterial("barmat", scene);
			mat.emissiveColor = COLORS.white;
			bar.material = mat;
			bar.renderingGroupId = 1;
			bars.push(bar);
		}
		return bars;
	}

	/** the stars in the background, will maybe move to abstract in template depending of the other maps's design */
	private createParticles(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		scene.clearColor = new babylon.Color4(0, 0, 0, 1); // sky
		const particles = new babylon.ParticleSystem("stars", D_PARTICLE_NUMBER, scene);
		particles.particleTexture = texture.clone();
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

	createSun(scene: babylon.Scene): babylon.Mesh {
		const sun = babylon.MeshBuilder.CreateSphere("sun", { diameter: SUN_DIAMETER }, scene);
		const sunMaterial = new babylon.StandardMaterial("sunMat", scene);
		sunMaterial.emissiveColor = COLORS.sunColorDefault;
		sun.material = sunMaterial;
		sun.position = new babylon.Vector3(-(MAP_SIZE.x / 2), MAP_SIZE.y * 0.7, -(MAP_SIZE.z / 2));
		return sun;
	}

	createLight(scene: babylon.Scene): babylon.DirectionalLight {
		const directionCenter: babylon.Vector3 = babylon.Vector3.Zero().subtract(this.sun.position).normalize();
		const light: babylon.DirectionalLight = new babylon.DirectionalLight("sunLight", directionCenter, scene);
		light.position = this.sun.position;
		light.intensity = 1;
		light.diffuse = COLORS.lightColorDefault;
		return light;
	}

	destroyRest(): void {
		this.bars.forEach(bar => {
			bar.material?.dispose();
			bar.dispose();
		});
		this.particles.stop(); // textures will be dispose at the end of the game
		this.particles.dispose();
		this.wallHighlight.dispose();
	}
}
