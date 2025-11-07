import * as babylon from "@babylonjs/core";
import { MAP_SIZE, WALL_WIDTH, METEOR_SPEED, METEOR_DIAMETER, METEOR_COLLISION_RADIUS, METEOR_COLLISION_STRENGTH, METEOR_LIFETIME, COLORS3, BALL_DIAMETER, COLORS4 } from "../../settings/values.js";
import { BallTemplate } from "../../ball/BallTemplate.js";

export class Meteor {
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly meteor: babylon.Mesh;
	private readonly meteorLight: babylon.PointLight;
	private readonly direction: babylon.Vector3;
	private body: babylon.PhysicsBody | null;
	private readonly particles: babylon.ParticleSystem;
	private readonly randomSize;
	private readonly trail: babylon.ParticleSystem;

	constructor(scene: babylon.Scene, texture: Record<string, babylon.Texture>) {
		this.randomSize = Math.random() * 5 + 1;
		const positionXStart = ((Math.random() - 0.5) * 2) * MAP_SIZE.x;
		const positionZStart = ((Math.random() - 0.5) * 2) * MAP_SIZE.z;
		const positionXEnd = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.x - WALL_WIDTH - (BALL_DIAMETER * this.randomSize)) / 2);
		const positionZEnd = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.z - WALL_WIDTH - (BALL_DIAMETER * this.randomSize)) / 2);
		const start = new babylon.Vector3(positionXStart, MAP_SIZE.y, positionZStart);
		const end = new babylon.Vector3(positionXEnd, 0, positionZEnd);
		this.direction = end.subtract(start).normalize();

		this.meteor = this.spawnMeteor(scene, start);
		this.meteorLight = this.createMeteorLight(scene);
		this.body = null;
		this.trail = this.createTrail(scene, texture.flare);
		this.sceneObservable = scene.onAfterRenderObservable;
		this.sceneObserver = this.observeScene(scene, start, end);
		this.particles = this.createContactParticles(scene, texture.smoke, end);
	}

	private spawnMeteor(scene: babylon.Scene, position: babylon.Vector3): babylon.Mesh {
		const meteor = babylon.MeshBuilder.CreatePolyhedron("meteor", { type: 2, size: METEOR_DIAMETER * this.randomSize }, scene);
		meteor.position = position;
		meteor.metadata = { type: "collider" };
		const material = new babylon.StandardMaterial("MeteorMat", scene);
		material.diffuseColor = COLORS3.volcanoDiffuseMeteor;
		material.specularColor = COLORS3.volcanoSpecularMeteor;
		material.specularPower = 32;
		material.emissiveColor = COLORS3.volcanoEmissiveMeteor;
		material.alpha = 1;
		meteor.material = material;
		meteor.renderingGroupId = 1;
		return meteor;
	}

	private createMeteorLight(scene: babylon.Scene): babylon.PointLight {
		const light = new babylon.PointLight("meteorLight", this.meteor.position, scene);
		light.diffuse = COLORS3.volcanoDiffuseMeteorLight;
		light.intensity = 1 * this.randomSize;
		light.range = 30 * this.randomSize;
		light.parent = this.meteor;
		return light;
	}

	private observeScene(scene: babylon.Scene, start: babylon.Vector3, end: babylon.Vector3): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			const ratio = scene.getAnimationRatio() / 60; //if game is slowed, meteor will also be
			const velocity = this.direction.scale(METEOR_SPEED * ratio);
			this.meteor.position.addInPlace(velocity);
			if (this.meteor.position.y < 0) {
				this.applyExplosionForce(scene, end);
				this.trail.stop();
				this.particles.start();
				this.setBody(scene);
				/**@todo no protection here ? */
				setTimeout( () => {
					this?.destroy();
				}, METEOR_LIFETIME);
				this.sceneObservable.remove(this.sceneObserver);
			}
		});
		return sceneObserver;
	} 

	private setBody(scene:babylon.Scene): void {
		const body = new babylon.PhysicsBody(this.meteor, babylon.PhysicsMotionType.STATIC, false, scene);
		body.setMassProperties({
			mass: 0,
			centerOfMass: babylon.Vector3.Zero()
		});
		body.shape = new babylon.PhysicsShapeMesh(this.meteor, scene);
		body.shape.material = { restitution: 1, friction: 0 };
		this.body = body;
	}

	private applyExplosionForce(scene: babylon.Scene, center: babylon.Vector3): void {
		scene.meshes.forEach(mesh => {
			if (!mesh.metadata?.pushable || !mesh.physicsBody)
				return ;
			const body = mesh.physicsBody;
			const meshPosition = mesh.getAbsolutePosition();
			const direction = meshPosition.subtract(center);
			const distance = direction.length();
			const explosionRadius = METEOR_COLLISION_RADIUS * this.randomSize * 2;

			if (distance < explosionRadius && distance > 0) { // if the mesh is in the explosion radius
				direction.normalize();
				const force = direction.scale(METEOR_COLLISION_STRENGTH * (1 - distance / explosionRadius) * this.randomSize);
				force.y = 0;
				if (mesh instanceof BallTemplate)
					mesh.setJustCollide();
				body.applyImpulse(force, meshPosition);
			}
		});
	}

	private createContactParticles(scene: babylon.Scene, texture: babylon.Texture, end: babylon.Vector3): babylon.ParticleSystem {
		const dustParticles = new babylon.ParticleSystem("MeteorDust", Math.floor(100 * this.randomSize), scene);
		dustParticles.particleTexture = texture;
		dustParticles.blendMode = babylon.ParticleSystem.BLENDMODE_STANDARD;
		dustParticles.emitter = end.clone();
		dustParticles.emitter.y += 1;
		dustParticles.renderingGroupId = 1;
		const emitter = new babylon.ConeParticleEmitter(90); // 90° = émet latéralement
		emitter.radius = METEOR_COLLISION_RADIUS * this.randomSize * 2;
		dustParticles.particleEmitterType = emitter;
		dustParticles.color1 = COLORS4.volcanoDiffuseDust1;
		dustParticles.color2 = COLORS4.volcanoDiffuseDust2;
		dustParticles.colorDead = COLORS4.volcanoDiffuseDustDead;
		dustParticles.minSize = 1 * this.randomSize;
		dustParticles.maxSize = 2 * this.randomSize;
		dustParticles.minEmitPower = 0.8;
		dustParticles.maxEmitPower = 1.8;
		dustParticles.minLifeTime = 2.5;
		dustParticles.maxLifeTime = 2.5;
		dustParticles.gravity = new babylon.Vector3(0, -1.5, 0);
		dustParticles.updateSpeed = 0.02;
		dustParticles.emitRate = 0;
		dustParticles.manualEmitCount = Math.floor(100 * this.randomSize);
		return dustParticles;
	}

	private createTrail(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		const trail = new babylon.ParticleSystem("meteorTrail", Math.floor(400 * this.randomSize), scene);
		trail.particleTexture = texture;
		trail.emitter = this.meteor;
		trail.particleEmitterType = new babylon.SphereParticleEmitter(METEOR_COLLISION_RADIUS * this.randomSize * 1.5);
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
		trail.emitRate = Math.floor(400 * this.randomSize);
		trail.start();
		return trail;
	}


	destroy(): void {
		this.sceneObservable?.remove(this.sceneObserver);
		this.body?.dispose();
		this.meteorLight?.dispose();
		this.trail?.stop();
		//this.trail?.particleTexture?.dispose();
		if (this.trail && this.trail.particleTexture)
			this.trail.particleTexture = null;
		this.trail?.dispose();
		this.particles?.stop();
		//this.particles?.particleTexture?.dispose();
		if (this.particles && this.particles.particleTexture)
			this.particles.particleTexture = null;
		this.particles?.dispose();
		this.meteor.material?.dispose();
		this.meteor?.dispose();
	}
}