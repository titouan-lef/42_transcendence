import * as babylon from "@babylonjs/core";
import { COLORS4, MAP_SIZE, TORNADO_ATTRACTION_STRENGTH, TORNADO_COLLISION_RADIUS, TORNADO_HEIGHT, TORNADO_LIFETIME, WALL_WIDTH } from "../../settings/values.js";

export class Tornado {
	private tornado: babylon.Mesh;
	private readonly particles: babylon.ParticleSystem;
	private readonly timeoutId: ReturnType<typeof setTimeout>;
	private readonly randomSize;
	private readonly tornadoObservable: babylon.Observable<babylon.Scene>;
	private readonly tornadoObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, texture: babylon.Texture, windforce: babylon.Vector3) {
		const possiblePositionX = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.x - WALL_WIDTH) / 2);
		const possiblePositionZ = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.z - WALL_WIDTH) / 2);
		const position = new babylon.Vector3(possiblePositionX, 0, possiblePositionZ);
		this.tornado = babylon.MeshBuilder.CreateBox("tornado", { width: 0.01, height: 0.01, depth: 0.01 }, scene);
		this.tornado.visibility = 0;
		this.tornado.position = position;
		this.randomSize = Math.random() * 4 + 3;

		this.particles = this.createTornadoParticles(scene, texture);

		this.tornadoObservable = scene.onBeforeRenderObservable;;
		this.tornadoObserver = this.setTornadoObserver(scene, windforce);
		this.timeoutId = setTimeout( () => {
			this.destroy();
		}, TORNADO_LIFETIME);
	}

	stopParticles(): void {
		this.particles?.stop();
	}

	private setTornadoObserver(scene: babylon.Scene, windforce: babylon.Vector3): babylon.Observer<babylon.Scene> {
		const tornadoObserver = this.tornadoObservable.add(() => {
			this.tornado.position = this.tornado.absolutePosition.addInPlace(windforce.scale(0.05));
			scene.meshes.forEach(mesh => {
				if (!mesh.metadata?.pushable || !mesh.physicsBody)
					return;
				const body = mesh.physicsBody;
				const meshPosition = mesh.getAbsolutePosition();
				const direction = meshPosition.subtract(this.tornado.absolutePosition);
				direction.y = 0;
				const distance = direction.length();
				const tornadoRadius = TORNADO_COLLISION_RADIUS * this.randomSize;
				if (distance < tornadoRadius && distance > 0) {
					const tangent = new babylon.Vector3(-direction.z, 0, direction.x).normalize();
					const distanceFromCenter = 1 - (distance / tornadoRadius);
					const turningForce = tangent.scale(TORNADO_ATTRACTION_STRENGTH * distanceFromCenter);
					const attractiveForce = direction.scale(-TORNADO_ATTRACTION_STRENGTH * distanceFromCenter);
					const totalForce = turningForce.add(attractiveForce);
					body.applyForce(totalForce, meshPosition);
				}
			});
		});
		return tornadoObserver;
	}

	private createTornadoParticles(scene: babylon.Scene, texture: babylon.Texture): babylon.ParticleSystem {
		const particles = new babylon.ParticleSystem("tornadoParticles", 4000, scene);
		particles.particleTexture = texture;
		particles.emitter = this.tornado;
		const emitter = new babylon.CustomParticleEmitter();
		particles.particleEmitterType = emitter;
		particles.renderingGroupId = 1;
		particles.minEmitPower = 25;
		particles.maxEmitPower = 25;
		particles.minLifeTime = 0.2;
		particles.maxLifeTime = 0.2;
		particles.minSize = 0.4;
		particles.maxSize = 0.7;
		particles.color1 = COLORS4.desertTornado1;
		particles.color2 = COLORS4.desertTornado2;
		particles.colorDead = COLORS4.desertTornadoDead;
		particles.emitRate = 4000;
		emitter.startPositionFunction = (worldMatrix, position): void => {
			const positionY = Math.random();
			const angle = Math.random() * Math.PI * 2;
			const local = new babylon.Vector3(
				Math.cos(angle) * TORNADO_COLLISION_RADIUS * Math.min(positionY + 0.2, 1) * this.randomSize,
				TORNADO_HEIGHT * positionY,
				Math.sin(angle) * TORNADO_COLLISION_RADIUS * Math.min(positionY + 0.2, 1) * this.randomSize
			);
			babylon.Vector3.TransformCoordinatesToRef(local, worldMatrix, position);
		};
		emitter.startDirectionFunction = (worldMatrix, direction, particle): void => {
			const inv = worldMatrix.clone().invert();
			const localPos = babylon.Vector3.TransformCoordinates(particle.position, inv);
			const tangent = new babylon.Vector3(
				-localPos.z,
				0.8,
				localPos.x
			).normalize();
			babylon.Vector3.TransformNormalToRef(tangent, worldMatrix, direction);
		};
		particles.start();
		return particles;
	}

	destroy(): void {
		clearTimeout(this.timeoutId);
		this.tornadoObservable.remove(this.tornadoObserver);
		this.particles?.stop();
		if (this.particles && this.particles.particleTexture)
			this.particles.particleTexture = null;
		this.particles?.dispose();
		this.tornado?.dispose();
	}
}