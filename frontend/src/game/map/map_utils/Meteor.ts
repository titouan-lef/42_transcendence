import * as babylon from "@babylonjs/core";
import { MAP_SIZE, METEOR_DIAMETER, METEOR_COLLISION_RADIUS, COLORS3, COLORS4, METEOR_LIFETIME } from "../../settings/values.js";
import { Position } from "../../types_transfert.js";

export class Meteor {
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly meteor: babylon.Mesh;
	private readonly meteorLight: babylon.PointLight;
	private body: babylon.PhysicsBody | null;
	// private readonly particles: babylon.ParticleSystem;
	private readonly size;
	private readonly trail: babylon.ParticleSystem;

	/** 
	 * @todo be the same as the one in the front
	 * send position each frame too ? then assosiate an id to each meteor ?
	 */
	constructor(scene: babylon.Scene, texture: babylon.Texture, position: Position, size: number) {
		this.size = size;
		const start = new babylon.Vector3(position.x, MAP_SIZE.y, position.z);
		this.meteor = this.spawnMeteor(scene, start);
		this.meteorLight = this.createMeteorLight(scene);
		this.body = null;
		this.trail = this.createTrail(scene, texture);
		this.sceneObservable = scene.onAfterRenderObservable;
		this.sceneObserver = this.observeScene(scene);
		// this.particles = this.createContactParticles(scene, texture.smoke, end);
	}

	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			if (this.meteor.position.y < 0) {
				setTimeout( () => {
					this?.destroy();
				}, METEOR_LIFETIME);
				this.sceneObservable.remove(this.sceneObserver);
			}
		});
		return sceneObserver;
	}

	private spawnMeteor(scene: babylon.Scene, position: babylon.Vector3): babylon.Mesh {
		const meteor = babylon.MeshBuilder.CreatePolyhedron("meteor", { type: 2, size: METEOR_DIAMETER * this.size }, scene);
		meteor.position = position;
		meteor.metadata = { type: "collider" };
		const material = new babylon.StandardMaterial("MeteorMat", scene);
		material.diffuseColor = COLORS3.volcanoDiffuseMeteor;
		material.emissiveColor = COLORS3.volcanoEmissiveMeteor;
		material.alpha = 1;
		meteor.material = material;
		meteor.renderingGroupId = 1;
		return meteor;
	}

	private createMeteorLight(scene: babylon.Scene): babylon.PointLight {
		const light = new babylon.PointLight("meteorLight", this.meteor.position, scene);
		light.diffuse = COLORS3.volcanoDiffuseMeteorLight;
		light.intensity = 1 * this.size;
		light.range = 30 * this.size;
		light.parent = this.meteor;
		return light;
	}

	private createContactParticles(scene: babylon.Scene, texture: babylon.Texture, end: babylon.Vector3): babylon.ParticleSystem {
		const dustParticles = new babylon.ParticleSystem("MeteorDust", Math.floor(100 * this.size), scene);
		dustParticles.particleTexture = texture;
		dustParticles.blendMode = babylon.ParticleSystem.BLENDMODE_STANDARD;
		dustParticles.emitter = end.clone();
		dustParticles.emitter.y += 1;
		dustParticles.renderingGroupId = 1;
		const emitter = new babylon.ConeParticleEmitter(90);
		emitter.radius = METEOR_COLLISION_RADIUS * this.size * 2;
		dustParticles.particleEmitterType = emitter;
		dustParticles.color1 = COLORS4.volcanoDiffuseDust1;
		dustParticles.color2 = COLORS4.volcanoDiffuseDust2;
		dustParticles.colorDead = COLORS4.volcanoDiffuseDustDead;
		dustParticles.minSize = 1 * this.size;
		dustParticles.maxSize = 2 * this.size;
		dustParticles.minEmitPower = 0.8;
		dustParticles.maxEmitPower = 1.8;
		dustParticles.minLifeTime = 2.5;
		dustParticles.maxLifeTime = 2.5;
		dustParticles.gravity = new babylon.Vector3(0, -1.5, 0);
		dustParticles.updateSpeed = 0.02;
		dustParticles.emitRate = 0;
		dustParticles.manualEmitCount = Math.floor(100 * this.size);
		return dustParticles;
	}

	updatePosition(position: Position): void {
		this.meteor.position.x = position.x;
		this.meteor.position.y = position.y;
		this.meteor.position.z = position.z;
	}

	private createTrail(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		const trail = new babylon.ParticleSystem("meteorTrail", Math.floor(400 * this.size), scene);
		trail.particleTexture = texture;
		trail.emitter = this.meteor;
		trail.particleEmitterType = new babylon.SphereParticleEmitter(METEOR_COLLISION_RADIUS * this.size * 1.5);
		trail.renderingGroupId = 1;
		trail.color1 = COLORS4.volcanoDiffuseTrail1;
		trail.color2 = COLORS4.volcanoDiffuseTrail2;
		trail.colorDead = COLORS4.volcanoDiffuseTrailDead;
		trail.minSize = 1;
		trail.maxSize = 1;
		trail.minLifeTime = 0.5;
		trail.maxLifeTime = 0.5;
		trail.minEmitPower = 0;
		trail.maxEmitPower = 0;
		trail.updateSpeed = 0.02;
		trail.gravity = new babylon.Vector3(0, 1, 0);
		trail.emitRate = Math.floor(400 * this.size);
		trail.start();
		return trail;
	}

	destroy(): void {
		this.sceneObservable?.remove(this.sceneObserver);
		this.body?.dispose();
		this.meteorLight?.dispose();
		this.trail?.stop();
		if (this.trail && this.trail.particleTexture)
			this.trail.particleTexture = null;
		this.trail?.dispose();
		// this.particles?.stop();
		// if (this.particles && this.particles.particleTexture)
		// 	this.particles.particleTexture = null;
		// this.particles?.dispose();
		this.meteor.material?.dispose();
		this.meteor?.dispose();
	}
}