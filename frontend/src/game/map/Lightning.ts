import * as babylon from "/babylonjs/core/index.js";
import { MAP_SIZE, WALL_WIDTH, LIGHTNING_FADING_INTERVAL, LIGHTNING_COLLISION_RADIUS, LIGHTNING_COLLISION_STRENGTH } from "../values.js";

export class Lightning {
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
		const material = new babylon.StandardMaterial("boltMat", scene);
		material.emissiveColor = new babylon.Color3(2.7, 2.85, 3);
		material.alpha = 1;
		this.lightning.material = material;
		this.lightning.renderingGroupId = 2;
		this.lightningIntervalId = this.animateBoltFade(material);
		this.applyExplosionForce(scene, end);
		this.particles = this.createContactParticles(scene, end, texture);

		this.particles.start();
		this.timeoutId = setTimeout( () => {
			this.destroy();
		}, 2000);
	}

	private spawnLightning(scene: babylon.Scene, start: babylon.Vector3, end: babylon.Vector3): babylon.Mesh {
		const points = this.makeLightningPoints(start, end);
		const lightning = babylon.MeshBuilder.CreateTube("bolt", {
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
	private animateBoltFade(material: babylon.StandardMaterial): ReturnType<typeof setInterval> {
		let fade = 1.0;
		const lightningIntervalId = setInterval(() => {
			fade -= 0.04;
			material.emissiveColor = new babylon.Color3(0.8 * fade, 0.85 * fade, fade);
			material.alpha = fade;
			if (fade <= 0.6) {
				this.lightning.visibility = 0;
			}
		}, LIGHTNING_FADING_INTERVAL * this.randomSize);
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
			const explosionRadius = LIGHTNING_COLLISION_RADIUS * this.randomSize;

			if (distance < explosionRadius && distance > 0) { // if the mesh is in the explosion radius
				direction.normalize();
				const force = direction.scale(LIGHTNING_COLLISION_STRENGTH * (1 - distance / explosionRadius) * this.randomSize);
				force.y = 0;
				body.applyImpulse(force, meshPosition);
			}
		});
	}

	protected createContactParticles(scene: babylon.Scene, position: babylon.Vector3, texture: babylon.Texture): babylon.ParticleSystem {
		const explosionParticles = new babylon.ParticleSystem("lightning", Math.floor(200 * this.randomSize), scene);
		explosionParticles.particleTexture = texture.clone();
		explosionParticles.emitter = position;
		explosionParticles.createSphereEmitter(LIGHTNING_COLLISION_RADIUS * this.randomSize);
		explosionParticles.renderingGroupId = 1;
		explosionParticles.color1 = new babylon.Color4(0.5, 0.6, 1.0, 1.0);
		explosionParticles.minSize = 0.3 * this.randomSize;
		explosionParticles.maxSize = 0.3 * this.randomSize;
		explosionParticles.minEmitPower = 2;
		explosionParticles.maxEmitPower = 4;
		explosionParticles.updateSpeed = 0.02;

		// does a burst
		explosionParticles.emitRate = 0;
		explosionParticles.manualEmitCount = Math.floor(200 * this.randomSize);
		return explosionParticles;
	}

	destroy(): void {
		if (this.lightningIntervalId)
			clearInterval(this.lightningIntervalId);
		if (this.timeoutId)
			clearTimeout(this.timeoutId);
		this.particles?.stop();
		this.particles?.dispose();
		this.lightning.material?.dispose();
		this.lightning?.dispose();
	}
}