import * as babylon from "@babylonjs/core";
import { MapOption } from "../GameSettings.js";
import { MAP_SIZE, WALL_HEIGHT, WALL_WIDTH, COLORS, PLAYER_DIMENSION, GLOW_INTENSITY } from "../values.js";

export abstract class MapTemplate {
	protected glow: babylon.GlowLayer;
	protected readonly ground: babylon.Mesh;
	/**Ceiling is an invisible ceiling that deny the player from rotating in the air */
	protected readonly ceiling: babylon.Mesh;
	protected readonly limits: babylon.Mesh[];
	protected readonly sun: babylon.Mesh;
	protected readonly light: babylon.DirectionalLight;
	readonly type: MapOption;

	constructor(scene: babylon.Scene, type: MapOption) {
		this.type = type;
		this.ground = this.createGround(scene);
		this.ceiling = babylon.MeshBuilder.CreateGround("ceiling", { width: MAP_SIZE.x, height: MAP_SIZE.z }, scene);
		this.ceiling.position.y = PLAYER_DIMENSION.y + 0.1;
		this.ceiling.visibility = 0;
		this.ground.renderingGroupId = 1;
		this.limits = this.createLimits(scene);
		this.limits.forEach(limit => limit.renderingGroupId = 1);
		this.sun = this.createSun(scene);
		this.light = this.createLight(scene);
		this.glow = new babylon.GlowLayer("glow", scene);
		this.glow.intensity = GLOW_INTENSITY;
	}

	/**creates limit with goalplayer being the goal of each player and limit being a simple wall */
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
		this.ground.material?.dispose();
		this.ground.dispose();
		this.ceiling.dispose();
		for (let i = 0; i < this.limits.length; i++) {
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
