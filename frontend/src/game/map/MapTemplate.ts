import * as babylon from "@babylonjs/core";
import { MapOption } from "../settings/GameSettings.js";
import { MAP_SIZE, WALL_HEIGHT, WALL_WIDTH, CAMERA_POS_X, SCORE_POS_Y } from "../settings/values.js";
import { PlanePosition } from "../types_transfert.js";

abstract class MapTemplate {
	protected glow: babylon.GlowLayer;
	protected readonly ground: babylon.Mesh;
	protected readonly limits: babylon.Mesh[];
	protected readonly sun: babylon.Mesh;
	protected readonly light: babylon.DirectionalLight;
	private readonly type: MapOption;
	protected readonly sunPosition: babylon.Vector3;
	protected wallHighlight: babylon.HighlightLayer | null = null;
	protected readonly wind: PlanePosition;

	constructor(scene: babylon.Scene, type: MapOption, wind: PlanePosition) {
		this.type = type;
		this.wind = wind;
		this.ground = this.createGround(scene);
		this.ground.renderingGroupId = 1;
		this.limits = this.createLimits(scene);
		this.limits.forEach(limit => limit.renderingGroupId = 1);
		this.sunPosition = this.getSunPosition(scene);
		this.sun = this.createSun(scene);
		this.light = this.createLight(scene);
		this.glow = new babylon.GlowLayer("glow", scene);
	}

	private createCollider(scene: babylon.Scene, position: PlanePosition): babylon.Mesh {
		const size = new babylon.Vector3(MAP_SIZE.x, WALL_HEIGHT, WALL_WIDTH);
		const border = this.createLimit(scene, size);
		border.position = new babylon.Vector3(position.x, WALL_HEIGHT/2, position.z);
		return border;
	}

	private createGoal(scene: babylon.Scene, position: PlanePosition): babylon.Mesh {
		const size = new babylon.Vector3(WALL_WIDTH, WALL_HEIGHT, MAP_SIZE.z - WALL_WIDTH * 2);
		const border = this.createLimit(scene, size);
		border.position = new babylon.Vector3(position.x, WALL_HEIGHT/2, position.z);
		return border;
	}

	/**creates limit with type: goal being the goal of each player and limit being a simple wall */
	private createLimits(scene: babylon.Scene): babylon.Mesh[] {
		const limits: babylon.Mesh[] = [];

		limits.push(this.createCollider(scene, { x: 0, z: WALL_WIDTH/2 - MAP_SIZE.z/2 }));
		limits.push(this.createCollider(scene, { x: 0, z: MAP_SIZE.z/2 - WALL_WIDTH/2 }));
		limits.push(this.createGoal(scene, { x: WALL_WIDTH/2 - MAP_SIZE.x/2, z: 0 }));
		limits.push(this.createGoal(scene, { x: MAP_SIZE.x/2 - WALL_WIDTH/2, z: 0 }));
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
		this.destroyRest();
		if (this.ground.material && this.ground.material instanceof babylon.StandardMaterial) {
			this.ground.material.bumpTexture?.dispose();
			this.ground.material.diffuseTexture?.dispose();
		}
		this.ground?.material?.dispose();
		this.ground?.dispose();
		for (let i = 0; i < this.limits.length; i++) {
			this.limits[i]?.material?.dispose();
			this.limits[i]?.dispose();
		}
		this.sun?.material?.dispose();
		this.sun?.dispose();
		this.light?.dispose();
		this.glow?.dispose();
		this.wallHighlight?.dispose();
	}

	abstract createGround(scene: babylon.Scene): babylon.Mesh;

	abstract createLight(scene: babylon.Scene): babylon.DirectionalLight;

	abstract createSun(scene: babylon.Scene): babylon.Mesh;

	abstract createLimit(scene: babylon.Scene, dimension: babylon.Vector3): babylon.Mesh;

	abstract destroyRest(): void;
}

export { MapTemplate };