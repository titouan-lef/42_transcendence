import * as babylon from "/babylonjs/core/index.js";
import { MAP_SIZE, TORNADO_ATTRACTION_STRENGTH, TORNADO_COLLISION_RADIUS, TORNADO_FADING_INTERVAL, TORNADO_LIFETIME, WALL_WIDTH } from "../../settings/values.js";
import { BallTemplate } from "../../ball/BallTemplate.js";

export class Tornado {
	private readonly lightningIntervalId: ReturnType<typeof setInterval>;
	private readonly lightning: babylon.Mesh;
	private readonly particles: babylon.ParticleSystem;
	private readonly timeoutId: ReturnType<typeof setTimeout>;
	private readonly randomSize;

	constructor(scene: babylon.Scene, texture: babylon.Texture) {
		const possiblePositionX = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.x - WALL_WIDTH) / 2);
		const possiblePositionZ = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.z - WALL_WIDTH) / 2);
		const start = new babylon.Vector3(possiblePositionX, MAP_SIZE.y, possiblePositionZ);
		const end = new babylon.Vector3(possiblePositionX, 0, possiblePositionZ);
		this.randomSize = Math.random() * 4 + 1;

		this.lightning = this.spawnLightning(scene, start, end);
		const material = new babylon.StandardMaterial("lightningMat", scene);
		material.emissiveColor = new babylon.Color3(2.7, 2.85, 3);
		material.alpha = 1;
		this.lightning.material = material;
		this.lightning.renderingGroupId = 2;
		this.lightningIntervalId = this.animateLightningFade(material);
		this.applyExplosionForce(scene, end);
		this.particles = this.createContactParticles(scene, end, texture);

		this.particles.start();
		this.timeoutId = setTimeout( () => {
			this.destroy();
		}, TORNADO_LIFETIME);
	}

	private spawnLightning(scene: babylon.Scene, start: babylon.Vector3, end: babylon.Vector3): babylon.Mesh {
		const points = this.makeLightningPoints(start, end);
		const lightning = babylon.MeshBuilder.CreateTube("lightning", {
			path: points,
			radius: 0.25 * this.randomSize,              
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
	private animateLightningFade(material: babylon.StandardMaterial): ReturnType<typeof setInterval> {
		let fade = 1.0;
		const lightningIntervalId = setInterval(() => {
			fade -= 0.04;
			material.emissiveColor = new babylon.Color3(0.8 * fade, 0.85 * fade, fade);
			material.alpha = fade;
			if (fade <= 0.6) {
				this.lightning.visibility = 0;
			}
		}, TORNADO_FADING_INTERVAL * this.randomSize);
		return lightningIntervalId;
	}

	private applyExplosionForce(scene: babylon.Scene, center: babylon.Vector3): void {
		scene.meshes.forEach(mesh => {
			if (!mesh.metadata?.pushable || !mesh.physicsBody)
				return ;
			const body = mesh.physicsBody;
			const meshPosition = mesh.getAbsolutePosition();
			const direction = meshPosition.subtract(center);
			const distance = direction.length();
			const explosionRadius = TORNADO_COLLISION_RADIUS * this.randomSize;

			if (distance < explosionRadius && distance > 0) { // if the mesh is in the explosion radius
				direction.normalize();
				const force = direction.scale(TORNADO_ATTRACTION_STRENGTH * (1 - distance / explosionRadius) * this.randomSize);
				force.y = 0;
				if (mesh instanceof BallTemplate)
					mesh.setJustCollide();
				body.applyImpulse(force, meshPosition);
			}
		});
	}

	private createContactParticles(scene: babylon.Scene, position: babylon.Vector3, texture: babylon.Texture): babylon.ParticleSystem {
		const particles = new babylon.ParticleSystem("lightningSparks", Math.floor(50 * this.randomSize), scene);
		particles.particleTexture = texture;
		particles.emitter = position;
		const emitter = new babylon.ConeParticleEmitter();
		emitter.radius = TORNADO_COLLISION_RADIUS * this.randomSize;
		emitter.directionRandomizer = 0.8;
		particles.particleEmitterType = emitter;
		particles.billboardMode = babylon.ParticleSystem.BILLBOARDMODE_STRETCHED;
		particles.blendMode = babylon.ParticleSystem.BLENDMODE_ADD;
		particles.addColorGradient(0.0, new babylon.Color4(1.0, 1.0, 1.0, 1.0));
		particles.addColorGradient(0.3, new babylon.Color4(0.6, 0.8, 1.0, 0.9));
		particles.addColorGradient(1.0, new babylon.Color4(0.2, 0.5, 1.0, 0.0));
		particles.minSize = 3;
		particles.maxSize = 4;
		particles.minLifeTime = 0.4;
		particles.maxLifeTime = 0.6;
		particles.minEmitPower = 10;
		particles.maxEmitPower = 30;
		particles.updateSpeed = 0.012;
		particles.emitRate = 0;
		particles.manualEmitCount = Math.floor(35 * this.randomSize);
		particles.renderingGroupId = 2;
		return particles;
	}


	destroy(): void {
		clearInterval(this.lightningIntervalId);
		clearTimeout(this.timeoutId);
		this.particles?.stop();
		//this.particles?.particleTexture?.dispose();
		if (this.particles && this.particles.particleTexture)
			this.particles.particleTexture = null;
		this.particles?.dispose();
		this.lightning?.material?.dispose();
		this.lightning?.dispose();
	}
}