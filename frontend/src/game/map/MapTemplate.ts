import * as babylon from "@babylonjs/core";
import { MapOption } from "../settings/GameSettings.js";
import { MAP_SIZE, WALL_HEIGHT, WALL_WIDTH, CAMERA_POS_X, SCORE_POS_Y, START_TIMEOUT } from "../settings/values.js";

export abstract class MapTemplate {
	protected glow: babylon.GlowLayer;
	protected readonly ground: babylon.Mesh;
	protected readonly groundPhysic: babylon.PhysicsAggregate;
	protected readonly limits: babylon.Mesh[];
	protected readonly limitsPhysic: babylon.PhysicsAggregate[] = [];
	protected readonly sun: babylon.Mesh;
	protected readonly light: babylon.DirectionalLight;
	readonly type: MapOption;
	protected readonly sunPosition: babylon.Vector3;
	private readonly startTimeout: ReturnType<typeof setTimeout>;
	protected gameStopped = true;

	constructor(scene: babylon.Scene, type: MapOption) {
		this.type = type;
		this.ground = this.createGround(scene);
		this.groundPhysic = new babylon.PhysicsAggregate(this.ground, babylon.PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 1 }, scene);
		this.ground.renderingGroupId = 1;
		this.limits = this.createLimits(scene);
		this.limits.forEach(limit => limit.renderingGroupId = 1);
		this.limits.forEach(limit => this.setLimitPhysic(scene, limit));
		this.sunPosition = this.getSunPosition(scene);
		this.sun = this.createSun(scene);
		this.light = this.createLight(scene);
		this.glow = new babylon.GlowLayer("glow", scene);
		this.startTimeout = setTimeout(() => {
			this.gameStopped = false;
		}, START_TIMEOUT);
	}

	predeath(): void {
		this.gameStopped = true;
	}

	setLimitPhysic(scene: babylon.Scene, limit: babylon.Mesh): void {
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

	private getSunPosition(scene: babylon.Scene): babylon.Vector3 {
		const camera = scene.getCameraByName("camera");
		let sunPosition = babylon.Vector3.Zero();
		if (camera === null || !(camera instanceof babylon.ArcRotateCamera))
			return sunPosition;
		const direction = camera.target.subtract(camera.position);
		direction.y = 0;
		direction.normalize();
		const planePosition = camera.position.add(direction.scale(CAMERA_POS_X + (MAP_SIZE.x * 0.6)));
		sunPosition = new babylon.Vector3(planePosition.x, SCORE_POS_Y, planePosition.z);
		return sunPosition;
	}

	destroy(): void {
		clearTimeout(this.startTimeout);
		this.destroyRest();
		this.groundPhysic?.dispose();
		if (this.ground.material && this.ground.material instanceof babylon.StandardMaterial) {
			this.ground.material.bumpTexture?.dispose();
			this.ground.material.diffuseTexture?.dispose();
		}
		this.ground?.material?.dispose();
		this.ground?.dispose();
		for (let i = 0; i < this.limits.length; i++) {
			this.limitsPhysic[i]?.dispose();
			this.limits[i]?.material?.dispose();
			this.limits[i]?.dispose();
		}
		this.sun?.material?.dispose();
		this.sun?.dispose();
		this.light?.dispose();
		this.glow?.dispose();
	}

	abstract createGround(scene: babylon.Scene): babylon.Mesh;

	abstract createLight(scene: babylon.Scene): babylon.DirectionalLight;

	abstract createSun(scene: babylon.Scene): babylon.Mesh;

	abstract createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh;

	abstract destroyRest(): void;
}