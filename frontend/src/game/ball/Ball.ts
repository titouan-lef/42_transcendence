import * as babylon from "@babylonjs/core";
import { BallOption } from "../settings/GameSettings.js";
import { BALL_DIAMETER, BALL_TRAIL_INTERVAL, BALL_TRAIL_ON } from "../settings/values.js";
import { BallTrail } from "./BallTrail.js";
import { Position } from "../types_transfert.js";
import { ParticlesType } from "../types_transfert.js";

class Ball {
	protected readonly color: babylon.Color3;
	private readonly ballTrails: BallTrail[] = [];
	protected readonly particles: babylon.ParticleSystem[] = [];
	private readonly textures: Record<string, babylon.Texture>;
	protected readonly mesh: babylon.Mesh;
	private sceneObservable: babylon.Observable<babylon.Scene> | null = null;
	private sceneObserver: babylon.Observer<babylon.Scene> | null = null;
	private trailTimer = 0;

	constructor(scene: babylon.Scene, type: BallOption, textures: Record<string, babylon.Texture>, color: babylon.Color3) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.mesh.renderingGroupId = 1;
		this.color = color;
		this.textures = textures;
		this.setMaterial(scene);
		if (BALL_TRAIL_ON) {
			this.sceneObservable = scene.onBeforeRenderObservable;
			this.sceneObserver = this.observeScene(scene);
		}
	}

	private setMaterial(scene: babylon.Scene): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = this.color;
		this.mesh.material = material;
	}

	/** trail behind the ball */
	private observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> | null {
		if (!this.sceneObservable)
			return null;
		const sceneObserver = this.sceneObservable?.add(() => {
			this.trailTimer++;
			if (this.trailTimer >= BALL_TRAIL_INTERVAL) {
				this.ballTrails.push(new BallTrail(scene, this.mesh.position, this.color, this.mesh.visibility));
				while (this.ballTrails.length && this.ballTrails[0].hasDisappeared()) {
					this.ballTrails.splice(0, 1);
				}
				this.trailTimer = 0;
			}
		});
		return sceneObserver;
	}

	/** particles on collides */
	private createCollisionParticles(scene: babylon.Scene, position: Position): babylon.ParticleSystem {
		const collisionParticles = new babylon.ParticleSystem("collision", 100, scene);
		collisionParticles.particleTexture = this.textures.spark.clone();
		collisionParticles.emitter = new babylon.Vector3(position.x, position.y, position.z);
		collisionParticles.createSphereEmitter(BALL_DIAMETER * 2);
		collisionParticles.renderingGroupId = 1;
		collisionParticles.color1 = new babylon.Color4(this.color.r, this.color.g, this.color.b, 1.0);
		collisionParticles.colorDead = new babylon.Color4(this.color.r, this.color.g, this.color.b, 1.0);
		collisionParticles.minSize = 0.3;
		collisionParticles.maxSize = 0.3;
		collisionParticles.minLifeTime = 0.2;
		collisionParticles.maxLifeTime = 0.2;
		collisionParticles.minEmitPower = 4;
		collisionParticles.maxEmitPower = 6;
		collisionParticles.emitRate = 0;
		collisionParticles.manualEmitCount = 100;
		return collisionParticles;
	}

	/** particles on goal */
	private createExplosionParticles(scene: babylon.Scene, position: Position): babylon.ParticleSystem {
		const explosionParticles = new babylon.ParticleSystem("explosion", 200, scene);
		explosionParticles.particleTexture = this.textures.flare.clone();
		explosionParticles.emitter = new babylon.Vector3(position.x, position.y, position.z);
		explosionParticles.createSphereEmitter(BALL_DIAMETER * 10);
		explosionParticles.renderingGroupId = 1;
		explosionParticles.color1 = new babylon.Color4(1, 0.5, 0, 1);
		explosionParticles.color2 = new babylon.Color4(1, 0.2, 0, 1);
		explosionParticles.colorDead = new babylon.Color4(0, 0, 0, 0);
		explosionParticles.minSize = 5;
		explosionParticles.maxSize = 10;
		explosionParticles.minEmitPower = 5;
		explosionParticles.maxEmitPower = 15;
		explosionParticles.updateSpeed = 0.02;
		explosionParticles.emitRate = 0;
		explosionParticles.manualEmitCount = 200;
		return explosionParticles;
	}

	/** particles on impulses */
	protected createImpulseParticles(scene: babylon.Scene, position: Position): babylon.ParticleSystem {
		const explosionParticles = new babylon.ParticleSystem("impulse", 100, scene);
		explosionParticles.particleTexture = this.textures.flare.clone();
		explosionParticles.emitter = new babylon.Vector3(position.x, position.y, position.z);
		explosionParticles.createSphereEmitter(BALL_DIAMETER * 2);
		explosionParticles.renderingGroupId = 1;
		explosionParticles.color1 = new babylon.Color4(this.color.r, this.color.g, this.color.b, 1.0);
		explosionParticles.minSize = 3;
		explosionParticles.maxSize = 3;
		explosionParticles.minEmitPower = 2;
		explosionParticles.maxEmitPower = 4;
		explosionParticles.updateSpeed = 0.02;
		explosionParticles.emitRate = 0;
		explosionParticles.manualEmitCount = 100;
		return explosionParticles;
	}

	setPosition(position: Position): void {
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		this.mesh.position.z = position.z;
	}

	setVisibility(visibility: number): void {
		this.mesh.visibility = visibility;
	}

	/** Spawn particules */
	showParticles(collisionPoint: Position, scene: babylon.Scene, type: ParticlesType): void {
		if (collisionPoint === null)
			return;
		let particle: babylon.ParticleSystem;
		switch (type) {
			case "collision":
				particle = this.createCollisionParticles(scene, collisionPoint);
				break;
			case "explosion":
				particle = this.createExplosionParticles(scene, collisionPoint);
				break;
			case "impulse":
				particle = this.createImpulseParticles(scene, collisionPoint);
				break;
			default:
				throw new Error("Particle not known") ;
		}
		this.particles.push(particle);
		particle.start();
		/**@todo if PAUSE, DO NOT DISPOSE*/
		setTimeout( () => {
			particle?.stop();
			if (particle.particleTexture)
				particle.particleTexture = null;
			const index = this.particles?.indexOf(particle);
			particle?.dispose();
			if (index !== -1)
				this.particles?.splice(index, 1);
		}, 2000);
	}

	destroy(): void {
		this.sceneObservable?.remove(this.sceneObserver);
		while (this.ballTrails.length) {
			this.ballTrails[0].destroy();
			this.ballTrails.splice(0, 1);
		}
		this.particles.forEach(particle => {
			particle.stop();
			if (particle.particleTexture)
				particle.particleTexture = null;
			particle.dispose();
		});
		while (this.particles.length)
			this.particles.splice(0, 1);
		this.mesh?.material?.dispose();
		this.mesh?.dispose();
	}
}

export { Ball };
