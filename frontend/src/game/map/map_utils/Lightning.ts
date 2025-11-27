import * as babylon from "@babylonjs/core";
import { MAP_SIZE, LIGHTNING_COLLISION_RADIUS, COLORS4, COLORS3 } from "../../settings/values.js";
import { Position } from "../../types_transfert.js";

class Lightning {
	private readonly lightning: babylon.Mesh;
	private readonly particles: babylon.ParticleSystem;
	private readonly size;

	constructor(scene: babylon.Scene, texture: babylon.Texture, position: Position, size: number) {
		const start = new babylon.Vector3(position.x, MAP_SIZE.y, position.z);
		const end = new babylon.Vector3(position.x, 0, position.z);
		this.size = size;

		this.lightning = this.spawnLightning(scene, start, end);
		const material = new babylon.StandardMaterial("lightningMat", scene);
		material.emissiveColor = COLORS3.skyEmissiveLightning;
		material.alpha = 1;
		this.lightning.material = material;
		this.lightning.renderingGroupId = 1;
		this.changeVisibility(1);
		this.particles = this.createContactParticles(scene, end, texture);
		this.particles.start();
	}

	private spawnLightning(scene: babylon.Scene, start: babylon.Vector3, end: babylon.Vector3): babylon.Mesh {
		const points = this.makeLightningPoints(start, end);
		const lightning = babylon.MeshBuilder.CreateTube("lightning", {
			path: points,
			radius: 0.25 * this.size,
			tessellation: 6, // sides of the circle
			updatable: false // less GPU ressources
		}, scene);
		return lightning;
	}

	/** zigzag path of the lightning */
	private makeLightningPoints(start: babylon.Vector3, end: babylon.Vector3): babylon.Vector3[] {
		const segments = 12;
		const diff = 5;
		const points: babylon.Vector3[] = [start.clone()];
		for (let i = 1; i < segments; i++) {
			const t = i / segments; // current travel of the point in the path from start to end
			const p = babylon.Vector3.Lerp(start, end, t); // if t = 0.5, the point is between start and end
			p.x += (Math.random() - 0.5) * diff * (1 - Math.abs(0.5 - t) * 2); // diff x
			p.z += (Math.random() - 0.5) * diff; // diff z
			points.push(p);
		}
		points.push(end.clone());
		return points;
	}

	/** fades slowly */
	changeVisibility(currentLifetime: number): void {
		if (currentLifetime <= 0 || !this.lightning.material || !(this.lightning.material instanceof babylon.StandardMaterial))
			return;
		this.lightning.material.emissiveColor = COLORS3.skyEmissiveLightning.scale(currentLifetime);
		this.lightning.material.alpha = currentLifetime;
	}

	private createContactParticles(scene: babylon.Scene, position: babylon.Vector3, texture: babylon.Texture): babylon.ParticleSystem {
		const particles = new babylon.ParticleSystem("lightningSparks", Math.floor(50 * this.size), scene);
		particles.particleTexture = texture.clone();
		particles.emitter = position;
		const emitter = new babylon.ConeParticleEmitter();
		emitter.radius = LIGHTNING_COLLISION_RADIUS * this.size;
		emitter.directionRandomizer = 0.8;
		particles.particleEmitterType = emitter;
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_STRETCHED;
		particles.blendMode = babylon.ParticleSystem.BLENDMODE_ADD;
		particles.addColorGradient(0.0, COLORS4.skyLightningSpark1);
		particles.addColorGradient(0.3, COLORS4.skyLightningSpark2);
		particles.addColorGradient(1.0, COLORS4.skyLightningSpark3);
		particles.minSize = 3;
		particles.maxSize = 4;
		particles.minLifeTime = 0.4;
		particles.maxLifeTime = 0.6;
		particles.minEmitPower = 10;
		particles.maxEmitPower = 30;
		particles.updateSpeed = 0.012;
		particles.emitRate = 0;
		particles.manualEmitCount = Math.floor(35 * this.size);
		particles.renderingGroupId = 1;
		return particles;
	}

	destroy(): void {
		this.particles?.stop();
		if (this.particles && this.particles.particleTexture)
			this.particles.particleTexture = null;
		this.particles?.dispose();
		this.lightning?.material?.dispose();
		this.lightning?.dispose();
	}
}

export { Lightning };