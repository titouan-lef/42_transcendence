import * as babylon from "@babylonjs/core";
import { MAP_SIZE, WALL_WIDTH, LIGHTNING_COLLISION_RADIUS, LIGHTNING_COLLISION_STRENGTH } from "../../settings/values.js";
import { BallTemplate } from "../../ball/BallTemplate.js";
import { Object, ObjectMessage, Status } from "../../../web_sockets/types_transfert.js";
import { WebSocket } from "ws";

export class Lightning {
	private readonly id: number;
	private readonly sockets: WebSocket[];
	private readonly position: babylon.Vector3;
	private readonly randomSize: number;

	constructor(scene: babylon.Scene, id: number, sockets: WebSocket[]) {
		this.id = id;
		this.sockets = sockets;
		const possiblePositionX = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.x - WALL_WIDTH) / 2);
		const possiblePositionZ = ((Math.random() - 0.5) * 2) * ((MAP_SIZE.z - WALL_WIDTH) / 2);
		this.position = new babylon.Vector3(possiblePositionX, 0, possiblePositionZ);
		this.randomSize = Math.random() * 4 + 1;
		this.applyExplosionForce(scene, this.position);
	}

	sendObjectInfos(): void {
		this.sockets.forEach(socket => {
			const infos: ObjectMessage = {
				status: Status.OBJECT,
				type: Object.LIGHTNING,
				id: this.id,
				position: {
					x: this.position.x,
					y: this.position.y,
					z: this.position.z
				},
				size: this.randomSize
			};

			socket.send(JSON.stringify(infos));
		});
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

			if (distance < explosionRadius && distance > 0) {
				direction.normalize();
				const force = direction.scale(LIGHTNING_COLLISION_STRENGTH * (1 - distance / explosionRadius) * this.randomSize);
				force.y = 0;
				if (mesh instanceof BallTemplate)
					mesh.setJustCollide();
				body.applyImpulse(force, meshPosition);
			}
		});
	}

	destroy(): void {}
}