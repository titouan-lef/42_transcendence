import * as babylon from "@babylonjs/core";
import { EventMessage, Position } from "../types_transfert";
import { BALL_DIAMETER } from "../settings/values";

class ParticuleManager {
	private readonly textures: Record<string, babylon.Texture>;
	private readonly particles: babylon.ParticleSystem[] = [];

	constructor(textures: Record<string, babylon.Texture>) {
		this.textures = textures;
	}

	/** particles on collides */
	createCollisionParticles(scene: babylon.Scene, position: Position, color: babylon.Color3): babylon.ParticleSystem {
		const particle = new babylon.ParticleSystem("collision", 100, scene);
		particle.particleTexture = this.textures.spark.clone();
		particle.emitter = new babylon.Vector3(position.x, position.y, position.z);
		particle.createSphereEmitter(BALL_DIAMETER * 2);
		particle.renderingGroupId = 1;
		particle.color1 = new babylon.Color4(color.r, color.g, color.b, 1.0);
		particle.minSize = 0.3;
		particle.maxSize = 0.3;
		particle.minLifeTime = 0.5;
		particle.maxLifeTime = 0.5;
		particle.minEmitPower = 4;
		particle.maxEmitPower = 6;
		particle.emitRate = 0;
		particle.manualEmitCount = 100;
		return particle;
	}

	/** particles on goal */
	createExplosionParticles(scene: babylon.Scene, position: Position, size: number): babylon.ParticleSystem {
		const particle = new babylon.ParticleSystem("explosion", 200, scene);
		particle.particleTexture = this.textures.flare.clone();
		particle.emitter = new babylon.Vector3(position.x, position.y, position.z);
		particle.createSphereEmitter(BALL_DIAMETER * 10 * size);
		particle.renderingGroupId = 1;
		particle.color1 = new babylon.Color4(1, 0.5, 0, 1);
		particle.color2 = new babylon.Color4(1, 0.2, 0, 1);
		particle.colorDead = new babylon.Color4(0, 0, 0, 0);
		particle.minSize = 5 * size;
		particle.maxSize = 10 * size;
		particle.minLifeTime = 2;
		particle.maxLifeTime = 2;
		particle.minEmitPower = 5 * size;
		particle.maxEmitPower = 15 * size;
		particle.updateSpeed = 0.02;
		particle.emitRate = 0;
		particle.manualEmitCount = 200;
		return particle;
	}

	/** particles on impulses */
	createImpulseParticles(scene: babylon.Scene, position: Position, color: babylon.Color3): babylon.ParticleSystem {
		const particle = new babylon.ParticleSystem("impulse", 100, scene);
		particle.particleTexture = this.textures.flare.clone();
		particle.emitter = new babylon.Vector3(position.x, position.y, position.z);
		particle.createSphereEmitter(BALL_DIAMETER * 2);
		particle.renderingGroupId = 1;
		particle.color1 = new babylon.Color4(color.r, color.g, color.b, 1.0);
		particle.minSize = 3;
		particle.maxSize = 3;
		particle.minLifeTime = 1;
		particle.maxLifeTime = 1;
		particle.minEmitPower = 2;
		particle.maxEmitPower = 4;
		particle.updateSpeed = 0.02;
		particle.emitRate = 0;
		particle.manualEmitCount = 100;
		return particle;
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

export { ParticuleManager };
