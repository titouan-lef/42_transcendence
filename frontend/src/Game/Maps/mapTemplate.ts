import * as babylon from "/babylonjs/core/index.js";
import { MapOption } from "../gameSettings.js";
import { MAP_SIZE, WALL_HEIGHT, WALL_WIDTH, COLORS, PLAYER_DIMENSION } from "../values.js";

export abstract class MapTemplate {
	protected readonly ground: babylon.Mesh;
	protected readonly groundPhysic: babylon.PhysicsAggregate;
	/**Ceiling is an invisible ceiling that deny the player from rotating in the air */
	protected readonly ceiling: babylon.Mesh;
	protected readonly ceilingPhysic: babylon.PhysicsAggregate;
	protected readonly limits: babylon.Mesh[];
	protected readonly limitsPhysic: babylon.PhysicsAggregate[] = [];
	protected readonly sun: babylon.Mesh;
	protected readonly light: babylon.DirectionalLight;
	readonly type: MapOption;

	constructor(scene: babylon.Scene, type: MapOption) {
		this.type = type;
		this.ground = this.createGround(scene);
		this.groundPhysic = new babylon.PhysicsAggregate(this.ground, babylon.PhysicsShapeType.BOX, { mass: 0 }, scene);
		this.ceiling = babylon.MeshBuilder.CreateGround("ceiling", { width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		this.ceiling.position.y = PLAYER_DIMENSION.y + 0.1;
		this.ceiling.visibility = 0;
		this.ceilingPhysic = new babylon.PhysicsAggregate(this.ceiling, babylon.PhysicsShapeType.BOX, { mass: 0 }, scene);
		this.ground.renderingGroupId = 1;
		this.limits = this.createLimits(scene);
		this.limits.forEach(limit => limit.renderingGroupId = 1);
		this.limits.forEach(limit => this.setLimitPhysic(scene, limit));
		this.sun = this.createSun(scene);
		this.light = this.createLight(scene);
	}

	setLimitPhysic(scene: babylon.Scene, limit: babylon.Mesh): void {
		const limitPhysic = new babylon.PhysicsAggregate(limit, babylon.PhysicsShapeType.BOX, { mass: 0 }, scene);
		this.limitsPhysic.push(limitPhysic);
	}

	/**creates limit with goalplayer being the goal of each player and limit being a simple wall */
	private createLimits(scene: babylon.Scene): babylon.Mesh[] {
		const material = new babylon.StandardMaterial('wallcolor', scene);
		material.diffuseColor =  COLORS.lime;
		const limits: babylon.Mesh[] = [];
		limits.push(this.createLimit(scene,
			new babylon.Vector3(MAP_SIZE.x, WALL_HEIGHT, WALL_WIDTH),
			new babylon.Vector3(0, WALL_HEIGHT/2, (WALL_WIDTH/2 - MAP_SIZE.z/2)),
			material, "limit"));
		limits.push(this.createLimit(scene,
			new babylon.Vector3(MAP_SIZE.x, WALL_HEIGHT, WALL_WIDTH),
			new babylon.Vector3(0, WALL_HEIGHT/2, (MAP_SIZE.z/2 - WALL_WIDTH/2)),
			material, "limit"));
		limits.push(this.createLimit(scene,
			new babylon.Vector3(WALL_WIDTH, WALL_HEIGHT, MAP_SIZE.z),
			new babylon.Vector3((-MAP_SIZE.x/2 + WALL_WIDTH/2), WALL_HEIGHT/2, 0),
			material, "goalplayer2"));
		limits.push(this.createLimit(scene,
			new babylon.Vector3(WALL_WIDTH, WALL_HEIGHT, MAP_SIZE.z),
			new babylon.Vector3((MAP_SIZE.x/2 - WALL_WIDTH/2), WALL_HEIGHT/2, 0),
			material, "goalplayer1"));
		return limits;
	}

	private createLimit(scene: babylon.Scene, dimension: babylon.Vector3, position: babylon.Vector3, material: babylon.StandardMaterial, name: string): babylon.Mesh {
		const newMesh = babylon.CreateBox(name, { width: dimension.x, height: dimension.y, depth: dimension.z }, scene);
		newMesh.material = material;
		newMesh.position = position;
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
		this.ceilingPhysic.dispose();
		this.ceiling.dispose();
		for (let i = 0; i < this.limits.length; i++) {
			this.limitsPhysic[i].dispose();
			this.limits[i].material?.dispose();
			this.limits[i].dispose();
		}
		this.sun.material?.dispose();
		this.sun.dispose();
		this.light.dispose();
		this.light.dispose();
	}
}