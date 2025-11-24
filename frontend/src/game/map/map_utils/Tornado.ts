import * as babylon from "@babylonjs/core";
import { COLORS4, TORNADO_COLLISION_RADIUS, TORNADO_HEIGHT } from "../../settings/values.js";
import { Position } from "../../types_transfert.js";

class Tornado {
	private tornado: babylon.Mesh;
	private readonly particles: babylon.ParticleSystem;
	private readonly size;

	constructor(scene: babylon.Scene, texture: babylon.Texture, position: Position, size: number) {
		this.tornado = babylon.MeshBuilder.CreateBox("tornado", { width: 0.01, height: 0.01, depth: 0.01 }, scene);
		this.tornado.visibility = 0;
		this.tornado.position.x = position.x;
		this.tornado.position.y = position.y;
		this.tornado.position.z = position.z;
		this.size = size;

		this.particles = this.createTornadoParticles(scene, texture);

	}

	stopParticles(): void {
		this.particles?.stop();
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
			const coeffVector = TORNADO_COLLISION_RADIUS * Math.min(positionY + 0.2, 1) * this.size;
			const local = new babylon.Vector3(
				Math.cos(angle) * coeffVector,
				TORNADO_HEIGHT * positionY,
				Math.sin(angle) * coeffVector
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

	updatePosition(position: Position): void {
		this.tornado.position.x = position.x;
		this.tornado.position.z = position.z;
	}

	destroy(): void {
		this.particles?.stop();
		if (this.particles && this.particles.particleTexture)
			this.particles.particleTexture = null;
		this.particles?.dispose();
		this.tornado?.dispose();
	}
}

export { Tornado };
