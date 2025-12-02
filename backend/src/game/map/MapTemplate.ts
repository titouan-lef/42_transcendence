import * as babylon from "@babylonjs/core";
import { MapOption } from "../settings/GameSettings.js";
import { MAP_SIZE, WALL_HEIGHT, WALL_WIDTH } from "../settings/values.js";
import { PlanePosition } from "../web_sockets/types_transfert.js";
import { Object } from "../web_sockets/types_transfert.js";

abstract class MapTemplate {
	protected readonly ground: babylon.Mesh;
	protected readonly groundPhysic: babylon.PhysicsAggregate;
	protected readonly limits: babylon.Mesh[];
	protected readonly limitsPhysic: babylon.PhysicsAggregate[] = [];
	private readonly type: MapOption;
	protected wind: PlanePosition = { x: 0, z: 0 };
	protected gameStopped = true;
	protected availableObjects: Object[] = [];

	constructor(scene: babylon.Scene, type: MapOption) {
		this.type = type;
		this.ground = this.createGround(scene);
		this.groundPhysic = new babylon.PhysicsAggregate(this.ground, babylon.PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 1 }, scene);

		this.limits = this.createLimits(scene);
		this.limits.forEach(limit => this.setLimitPhysic(scene, limit));
	}

	private setLimitPhysic(scene: babylon.Scene, limit: babylon.Mesh): void {
		const limitPhysic = new babylon.PhysicsAggregate(limit, babylon.PhysicsShapeType.BOX, { mass: 0, restitution: 1, friction: 0 }, scene);
		this.limitsPhysic.push(limitPhysic);
	}

	private createCollider(scene: babylon.Scene, position: PlanePosition): babylon.Mesh {
		const size = new babylon.Vector3(MAP_SIZE.x, WALL_HEIGHT, WALL_WIDTH);
		const border = this.createLimit(scene, size);
		border.position = new babylon.Vector3(position.x, WALL_HEIGHT/2, position.z);
		border.metadata = { type: "collider" };
		return border;
	}

	private createGoal(scene: babylon.Scene, playerId: 1 | 2, position: PlanePosition): babylon.Mesh {
		const size = new babylon.Vector3(WALL_WIDTH, WALL_HEIGHT, MAP_SIZE.z - WALL_WIDTH * 2);
		const border = this.createLimit(scene, size);
		border.position = new babylon.Vector3(position.x, WALL_HEIGHT/2, position.z);
		border.metadata = { type: "goal", player: playerId };
		return border;
	}

	/**creates limit with type: goal being the goal of each player and limit being a simple wall */
	private createLimits(scene: babylon.Scene): babylon.Mesh[] {
		const limits: babylon.Mesh[] = [];

		limits.push(this.createCollider(scene, { x: 0, z: WALL_WIDTH/2 - MAP_SIZE.z/2 }));
		limits.push(this.createCollider(scene, { x: 0, z: MAP_SIZE.z/2 - WALL_WIDTH/2 }));
		limits.push(this.createGoal(scene, 1, { x: WALL_WIDTH/2 - MAP_SIZE.x/2, z: 0 }));
		limits.push(this.createGoal(scene, 2, { x: MAP_SIZE.x/2 - WALL_WIDTH/2, z: 0 }));
		return limits;
	}

	start(): void {
		this.gameStopped = false;
	}

	stop(): void {
		this.gameStopped = true;
	}

	getAvailableObjects(): Object[] {
		return this.availableObjects;
	}

	getType(): MapOption {
		return this.type;
	}

	getWind(): PlanePosition {
		return this.wind;
	}

	destroy(): void {
		this.destroyRest();
		this.groundPhysic?.dispose();
		this.ground?.dispose();
		for (let i = 0; i < this.limits.length; i++) {
			this.limitsPhysic[i]?.dispose();
			this.limits[i]?.material?.dispose();
			this.limits[i]?.dispose();
		}
	}

	abstract createGround(scene: babylon.Scene): babylon.Mesh;

	abstract createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh;

	abstract destroyRest(): void;
}

export { MapTemplate };