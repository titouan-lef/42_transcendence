import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { MAP_SIZE, SUN_DIAMETER, WALL_WIDTH, D_PARTICLE_NUMBER, COLORS3, COLORS4, D_GLOW_INTENSITY } from "../settings/values.js";
import { PlanePosition } from "#shared/types_transfert";

class DefaultMap extends MapTemplate {
	private readonly bars: babylon.Mesh[];
	private readonly particles: babylon.ParticleSystem;
	private readonly wallHighlightColor: babylon.Color3 = COLORS3.defaultHighlightWall;

	constructor(scene: babylon.Scene, texture: babylon.Texture, wind: PlanePosition) {
		super(scene, "default", wind);
		this.glow.intensity = D_GLOW_INTENSITY;
		this.bars = this.createBars(scene);
		this.particles = this.createParticles(scene, texture);
		this.wallHighlight = new babylon.HighlightLayer("wallhighlight", scene);
		this.limits.forEach(limit => this.wallHighlight?.addMesh(limit, this.wallHighlightColor));
	}

	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("defaultground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		const material = new babylon.StandardMaterial('groundcolor', scene);
		material.diffuseColor =  COLORS3.defaultDiffuseGround;
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
			bar = babylon.MeshBuilder.CreateBox("bar", { width: 0.5, height: 0.1, depth: steps }, scene);
			bar.position = new babylon.Vector3(0, 0, startPositionZ);
			startPositionZ += steps * 2;
			const mat = new babylon.StandardMaterial("barmat", scene);
			mat.emissiveColor = COLORS3.defaultEmissiveBars;
			bar.material = mat;
			bar.renderingGroupId = 1;
			bars.push(bar);
		}
		return bars;
	}

	/** the stars in the background, will maybe move to abstract in template depending of the other maps's design */
	private createParticles(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		scene.clearColor = COLORS4.defaultSky;
		const particles = new babylon.ParticleSystem("stars", D_PARTICLE_NUMBER, scene);
		particles.particleTexture = texture.clone();
		particles.emitter = new babylon.Vector3(0, 0, 0);
		particles.minEmitBox = new babylon.Vector3(-MAP_SIZE.x * 1.4, -MAP_SIZE.y * 1.4, -MAP_SIZE.z * 1.4);
		particles.maxEmitBox = new babylon.Vector3(MAP_SIZE.x * 1.4, MAP_SIZE.y * 1.4, MAP_SIZE.y * 1.4);
		particles.color1 = COLORS4.defaultStar1;
		particles.color2 = COLORS4.defaultStar2;
		particles.colorDead = COLORS4.defaultStarDead;
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
		sunMaterial.emissiveColor = COLORS3.defaultEmissiveSun;
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
		light.diffuse = COLORS3.defaultDiffuseLight;
		return light;
	}

	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		const material = new babylon.StandardMaterial('wallcolor', scene);
		material.diffuseColor =  COLORS3.defaultDiffuseWall;
		newMesh.material = material;
		return newMesh;
	}

	destroyRest(): void {
		this.bars.forEach(bar => {
			bar.material?.dispose();
			bar.dispose();
		});
		this.particles?.stop();
		this.particles?.particleTexture?.dispose();
		this.particles?.dispose();
	}
}

export { DefaultMap };
