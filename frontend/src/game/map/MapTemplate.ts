import * as babylon from "@babylonjs/core";
import { MapOption } from "../GameSettings.js";
import { MAP_SIZE, WALL_HEIGHT, WALL_WIDTH, COLORS, PLAYER_DIMENSION, GLOW_INTENSITY } from "../values.js";

export abstract class MapTemplate {
	protected glow: babylon.GlowLayer;
	protected readonly ground: babylon.Mesh;
	protected readonly groundPhysic: babylon.PhysicsAggregate;
	protected readonly limits: babylon.Mesh[];
	protected readonly limitsPhysic: babylon.PhysicsAggregate[] = [];
	protected readonly sun: babylon.Mesh;
	protected readonly light: babylon.DirectionalLight;
	readonly type: MapOption;

	constructor(scene: babylon.Scene, type: MapOption) {
		this.type = type;
		this.ground = this.createGround(scene);
		this.groundPhysic = new babylon.PhysicsAggregate(this.ground, babylon.PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.2 }, scene);
		this.ground.renderingGroupId = 1;
		this.limits = this.createLimits(scene);
		this.limits.forEach(limit => limit.renderingGroupId = 1);
		this.limits.forEach(limit => this.setLimitPhysic(scene, limit));
		this.sun = this.createSun(scene);
		this.light = this.createLight(scene);
		this.glow = new babylon.GlowLayer("glow", scene);
		this.glow.intensity = GLOW_INTENSITY;
	}

	setLimitPhysic(scene: babylon.Scene, limit: babylon.Mesh): void {
		const limitPhysic = new babylon.PhysicsAggregate(limit, babylon.PhysicsShapeType.BOX, { mass: 0, restitution: 1, friction: 0.2 }, scene);
		this.limitsPhysic.push(limitPhysic);
	}

	/**creates limit with type: goal being the goal of each player and limit being a simple wall */
	private createLimits(scene: babylon.Scene): babylon.Mesh[] {
		const limits: babylon.Mesh[] = [];

		let newLimit: babylon.Mesh;
		newLimit = this.createLimit(scene, new babylon.Vector3(MAP_SIZE.x, WALL_HEIGHT, WALL_WIDTH));
		newLimit.position = new babylon.Vector3(0, WALL_HEIGHT/2, (WALL_WIDTH/2 - MAP_SIZE.z/2));
		newLimit.metadata = { type: "collider" };
		limits.push(newLimit);

		newLimit = this.createLimit(scene,
			new babylon.Vector3(MAP_SIZE.x, WALL_HEIGHT, WALL_WIDTH));
		newLimit.position = new babylon.Vector3(0, WALL_HEIGHT/2, (MAP_SIZE.z/2 - WALL_WIDTH/2));
		newLimit.metadata = { type: "collider" };
		limits.push(newLimit);

		newLimit = this.createLimit(scene,
			new babylon.Vector3(WALL_WIDTH, WALL_HEIGHT, MAP_SIZE.z));
		newLimit.position = new babylon.Vector3((-MAP_SIZE.x/2 + WALL_WIDTH/2), WALL_HEIGHT/2, 0);
		newLimit.metadata = { type: "goal", player: 1 };
		limits.push(newLimit);

		newLimit = this.createLimit(scene,
			new babylon.Vector3(WALL_WIDTH, WALL_HEIGHT, MAP_SIZE.z));
		newLimit.position = new babylon.Vector3((MAP_SIZE.x/2 - WALL_WIDTH/2), WALL_HEIGHT/2, 0);
		newLimit.metadata = { type: "goal", player: 2 };
		limits.push(newLimit);

		return limits;
	}

	private createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh {
		const newMesh = babylon.CreateBox("limit", { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		const material = new babylon.StandardMaterial('wallcolor', scene);
		material.diffuseColor =  COLORS.lime;
		newMesh.material = material;
		return newMesh;
	}

	abstract createGround(scene: babylon.Scene): babylon.Mesh;

	abstract createLight(scene: babylon.Scene): babylon.DirectionalLight;

	abstract createSun(scene: babylon.Scene): babylon.Mesh;

	abstract destroyRest(): void;

	destroy(): void {
		this.destroyRest();
		this.groundPhysic.dispose();
		this.ground.material?.dispose();
		this.ground.dispose();
		for (let i = 0; i < this.limits.length; i++) {
			this.limitsPhysic[i].dispose();
			this.limits[i].material?.dispose();
			this.limits[i].dispose();
		}
		this.sun.material?.dispose();
		this.sun.dispose();
		this.light.dispose();
		this.light.dispose();
		this.glow.dispose();
	}
}
