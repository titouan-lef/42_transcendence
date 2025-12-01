import * as babylon from "@babylonjs/core";
import { EventMessage, Position } from "../types_transfert";
import { BALL_DIAMETER } from "../settings/values";

export class ParticuleManager {
	private readonly textures: Record<string, babylon.Texture>;
	private readonly particles: babylon.ParticleSystem[] = [];

	constructor(textures: Record<string, babylon.Texture>) {
		this.textures = textures;
	}

	/** particles on collides */
	createCollisionParticles(scene: babylon.Scene, position: Position, color: babylon.Color3): babylon.ParticleSystem {
		const collisionParticles = new babylon.ParticleSystem("collision", 100, scene);
		collisionParticles.particleTexture = this.textures.spark.clone();
		collisionParticles.emitter = new babylon.Vector3(position.x, position.y, position.z);
		collisionParticles.createSphereEmitter(BALL_DIAMETER * 2);
		collisionParticles.renderingGroupId = 1;
		collisionParticles.color1 = new babylon.Color4(color.r, color.g, color.b, 1.0);
		collisionParticles.colorDead = new babylon.Color4(color.r, color.g, color.b, 1.0);
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
	createExplosionParticles(scene: babylon.Scene, position: Position, size: number): babylon.ParticleSystem {
		const explosionParticles = new babylon.ParticleSystem("explosion", 200, scene);
		explosionParticles.particleTexture = this.textures.flare.clone();
		explosionParticles.emitter = new babylon.Vector3(position.x, position.y, position.z);
		explosionParticles.createSphereEmitter(BALL_DIAMETER * 10 * size);
		explosionParticles.renderingGroupId = 1;
		explosionParticles.color1 = new babylon.Color4(1, 0.5, 0, 1);
		explosionParticles.color2 = new babylon.Color4(1, 0.2, 0, 1);
		explosionParticles.colorDead = new babylon.Color4(0, 0, 0, 0);
		explosionParticles.minSize = 5 * size;
		explosionParticles.maxSize = 10 * size;
		explosionParticles.minEmitPower = 5 * size;
		explosionParticles.maxEmitPower = 15 * size;
		explosionParticles.updateSpeed = 0.02;
		explosionParticles.emitRate = 0;
		explosionParticles.manualEmitCount = 200;
		return explosionParticles;
	}

	/** particles on impulses */
	createImpulseParticles(scene: babylon.Scene, position: Position, color: babylon.Color3): babylon.ParticleSystem {
		const explosionParticles = new babylon.ParticleSystem("impulse", 100, scene);
		explosionParticles.particleTexture = this.textures.flare.clone();
		explosionParticles.emitter = new babylon.Vector3(position.x, position.y, position.z);
		explosionParticles.createSphereEmitter(BALL_DIAMETER * 2);
		explosionParticles.renderingGroupId = 1;
		explosionParticles.color1 = new babylon.Color4(color.r, color.g, color.b, 1.0);
		explosionParticles.minSize = 3;
		explosionParticles.maxSize = 3;
		explosionParticles.minEmitPower = 2;
		explosionParticles.maxEmitPower = 4;
		explosionParticles.updateSpeed = 0.02;
		explosionParticles.emitRate = 0;
		explosionParticles.manualEmitCount = 100;
		return explosionParticles;
	}

	/** Spawn particules */
	showParticles(position: Position, scene: babylon.Scene, message: EventMessage): void {
		if (position === null)
			return;
		let particle: babylon.ParticleSystem;
		switch (message.type) {
			case "collision":
				particle = this.createCollisionParticles(scene, position, message.color);
				break;
			case "explosion":
				particle = this.createExplosionParticles(scene, position, message.size);
				break;
			case "impulse":
				particle = this.createImpulseParticles(scene, position, message.color);
				break;
			default:
				throw new Error("Particle not known") ;
		}
		this.particles.push(particle);
		particle.start();
		/**@todo if PAUSE, DO NOT DISPOSE*/
		setTimeout( () => {
			particle?.stop();
			const index = this.particles?.indexOf(particle);
			particle?.dispose();
			if (index !== -1)
				this.particles?.splice(index, 1);
		}, 2000);
	}

	clear(): void {
		this.particles.forEach(particle => {
			particle.stop();
			particle.particleTexture?.dispose();
			particle.dispose();
		});
		while (this.particles.length)
			this.particles.splice(0, 1);
	}
}