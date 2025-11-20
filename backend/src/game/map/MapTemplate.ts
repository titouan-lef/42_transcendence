import * as babylon from "@babylonjs/core";
import { MapOption } from "../settings/GameSettings.js";
import { MAP_SIZE, WALL_HEIGHT, WALL_WIDTH } from "../settings/values.js";
import { PlanePosition } from "../../web_sockets/types_transfert.js";

export abstract class MapTemplate {
	protected readonly ground: babylon.Mesh;
	protected readonly groundPhysic: babylon.PhysicsAggregate;
	protected readonly limits: babylon.Mesh[];
	protected readonly limitsPhysic: babylon.PhysicsAggregate[] = [];
	private readonly type: MapOption;
	protected wind: PlanePosition = { x: 0, z: 0 };
	protected gameStopped = true;

	constructor(scene: babylon.Scene, type: MapOption) {
		this.type = type;
		this.ground = this.createGround(scene);
		this.groundPhysic = new babylon.PhysicsAggregate(this.ground, babylon.PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 1 }, scene);
		this.ground.renderingGroupId = 1;
		this.limits = this.createLimits(scene);
		this.limits.forEach(limit => limit.renderingGroupId = 1);
		this.limits.forEach(limit => this.setLimitPhysic(scene, limit));
	}

	start(): void {
		this.gameStopped = false;
	}

	predeath(): void {
		this.gameStopped = true;
	}

	private setLimitPhysic(scene: babylon.Scene, limit: babylon.Mesh): void {
		const limitPhysic = new babylon.PhysicsAggregate(limit, babylon.PhysicsShapeType.BOX, { mass: 0, restitution: 1, friction: 0 }, scene);
		this.limitsPhysic.push(limitPhysic);
	}

	/**creates limit with type: goal being the goal of each player and limit being a simple wall */
	private createLimits(scene: babylon.Scene): babylon.Mesh[] {
		const limits: babylon.Mesh[] = [];

		let newLimit: babylon.Mesh;
		newLimit = this.createLimit(scene, new babylon.Vector3(MAP_SIZE.x, WALL_HEIGHT, WALL_WIDTH));
		newLimit.position = new babylon.Vector3(0, WALL_HEIGHT/2, (WALL_WIDTH/2 - MAP_SIZE.z/2));
		newLimit.metadata = { type: "collider", nature: "environnement" };
		limits.push(newLimit);

		newLimit = this.createLimit(scene,
			new babylon.Vector3(MAP_SIZE.x, WALL_HEIGHT, WALL_WIDTH));
		newLimit.position = new babylon.Vector3(0, WALL_HEIGHT/2, (MAP_SIZE.z/2 - WALL_WIDTH/2));
		newLimit.metadata = { type: "collider", nature: "environnement" };
		limits.push(newLimit);

		newLimit = this.createLimit(scene,
			new babylon.Vector3(WALL_WIDTH, WALL_HEIGHT, MAP_SIZE.z - WALL_WIDTH * 2));
		newLimit.position = new babylon.Vector3((-MAP_SIZE.x/2 + WALL_WIDTH/2), WALL_HEIGHT/2, 0);
		newLimit.metadata = { type: "goal", player: 1 };
		limits.push(newLimit);

		newLimit = this.createLimit(scene,
			new babylon.Vector3(WALL_WIDTH, WALL_HEIGHT, MAP_SIZE.z - WALL_WIDTH * 2));
		newLimit.position = new babylon.Vector3((MAP_SIZE.x/2 - WALL_WIDTH/2), WALL_HEIGHT/2, 0);
		newLimit.metadata = { type: "goal", player: 2 };
		limits.push(newLimit);

		return limits;
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