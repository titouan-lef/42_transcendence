import * as babylon from "@babylonjs/core";
import { MapTemplate } from "./MapTemplate.js";
import { Tornado } from "./map_utils/Tornado.js";
import { MAP_SIZE, SUN_DIAMETER, COLORS3, W_PARTICLE_NUMBER, TORNADO_INTERVAL, TORNADO_LIFETIME, WIND_FORCE } from "../settings/values.js";

export class WindyMap extends MapTemplate {
	private readonly particles: babylon.ParticleSystem;
	private readonly tornadoIntervalId: ReturnType<typeof setInterval>;
	private readonly tornados: Tornado[] = [];
	private readonly windForce;
	private readonly windObservable: babylon.Observable<babylon.Scene>;
	private readonly windObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		super(scene, "windy");
		this.windForce = new babylon.Vector3(
			(Math.random() - 0.5) * WIND_FORCE,
			0,
			(Math.random() - 0.5) * WIND_FORCE
		);
		this.windObservable = scene.onBeforeRenderObservable;
		this.windObserver = this.applyWind(scene);
		this.particles = this.createParticles(scene, texture.flare);
		this.tornadoIntervalId = this.tornadoInterval(scene, texture.flare);
	}

	private applyWind(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		const windObserver = this.windObservable.add(() => {
			if (this.gameStopped) {
				this.tornados.forEach(tornado => {
					tornado.stopParticles();
				});
				return ;
			}
			scene.meshes.forEach(mesh => {
				if (!mesh.physicsBody)
					return;
				mesh.physicsBody.applyForce(
					this.windForce,
					mesh.getAbsolutePosition()
				);
			});
		});
		return windObserver;
	}

	/** @todo to configure */
	createGround(scene: babylon.Scene): babylon.Mesh {
		const ground = babylon.MeshBuilder.CreateGround("rainyground",
			{ width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		const material = new babylon.StandardMaterial("groundMat", scene);
		material.diffuseColor = COLORS3.green;
		ground.material = material;
		ground.metadata = { type: "ground" };
		return ground;
	}

	/** @todo to configure */
	createSun(scene: babylon.Scene): babylon.Mesh {
		const sun = babylon.MeshBuilder.CreateSphere("sun", { diameter: SUN_DIAMETER }, scene);
		const sunMaterial = new babylon.StandardMaterial("sunMat", scene);
		sunMaterial.emissiveColor = COLORS3.orange;
		sun.material = sunMaterial;
		sun.position = this.sunPosition.clone();
		sun.position.z -= MAP_SIZE.z / 2;
		sun.position.y += 10;
		return sun;
	}

	/** @todo to configure */
	createLight(scene: babylon.Scene): babylon.DirectionalLight {
		const directionCenter: babylon.Vector3 = babylon.Vector3.Zero().subtract(this.sun.position).normalize();
		const light: babylon.DirectionalLight = new babylon.DirectionalLight("sunLight", directionCenter, scene);
		light.position = this.sun.position;
		light.intensity = 0.7;
		light.diffuse = COLORS3.orange;
		return light;
	}

	/** the rain */
	private createParticles(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		scene.clearColor = new babylon.Color4(0.5, 0.5, 0.5, 1); // sky
		const particles = new babylon.ParticleSystem("wind", W_PARTICLE_NUMBER, scene);
		particles.particleTexture = texture;
		particles.emitter = new babylon.Vector3(0, 0, 0);
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_Y;
		particles.minEmitBox = new babylon.Vector3(-MAP_SIZE.x * 1.4, -MAP_SIZE.y * 1, -MAP_SIZE.z * 1.4);
		particles.maxEmitBox = new babylon.Vector3(MAP_SIZE.x * 1.4, MAP_SIZE.y * 2, MAP_SIZE.y * 1.4);
		particles.color1 = new babylon.Color4(0.85, 0.9, 1.0, 0.85);
		particles.color2 = new babylon.Color4(0.85, 0.9, 1.0, 0.65);
		particles.colorDead = new babylon.Color4(0.85, 0.9, 1.0, 0.0);
		particles.emitRate = 1800;
		particles.renderingGroupId = 1; //
		particles.minEmitPower = 35;
		particles.maxEmitPower = 45;
		particles.minSize = 0.05;
		particles.maxSize = 0.1;
		particles.direction1 = this.windForce;
		particles.direction2 = this.windForce;
		particles.minLifeTime = 1;
		particles.maxLifeTime = 2;
		particles.updateSpeed = 0.008;
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_Y;
		particles.start();
		return particles;
	}

	/** will stack lighting till the end of the point */
	private tornadoInterval(scene: babylon.Scene, texture: babylon.Texture): ReturnType<typeof setInterval> {
		const tornadoIntervalId = setInterval( () => {
			if (this.gameStopped) {
				return;
			}
			const tornado = new Tornado(scene, texture, this.windForce);
			this.tornados.push(tornado);
			if (this.gameStopped)
				clearInterval(this.tornadoIntervalId);
			setTimeout(() => {
				const index = this.tornados?.indexOf(tornado);
				if (index !== -1)
					this.tornados?.splice(index, 1);
			}, TORNADO_LIFETIME + 100);
		}, TORNADO_INTERVAL);
		return tornadoIntervalId;
	}

	/** @todo to configure */
	createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.MeshBuilder.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		const material = new babylon.StandardMaterial('wallcolor', scene);
		material.diffuseColor =  COLORS3.lime;
		newMesh.material = material;
		return newMesh;
	}

	destroyRest(): void {
		clearInterval(this.tornadoIntervalId);
		while (this.tornados.length) {
			this.tornados[0].destroy();
			this.tornados.splice(0, 1);
		}
		this.windObservable.remove(this.windObserver);
		this.particles?.stop();
		if (this.particles && this.particles.particleTexture)
			this.particles.particleTexture = null;
		this.particles?.dispose();
	}
}
