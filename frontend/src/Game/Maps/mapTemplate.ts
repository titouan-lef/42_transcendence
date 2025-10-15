import * as babylon from "/babylonjs/index.js";
import { MapOption } from "../gameSettings.js";

export abstract class MapTemplate {
	protected readonly ground: babylon.Mesh;
	protected readonly limits: babylon.Mesh[];
	protected readonly sun: babylon.Mesh;
	protected readonly light: babylon.DirectionalLight;
	readonly type: MapOption;

	constructor(scene: babylon.Scene, type: MapOption) {
		this.type = type;
		this.ground = this.createGround(scene);
		this.ground.renderingGroupId = 1;
		this.limits = this.createLimits(scene);
		this.limits.forEach(limit => limit.renderingGroupId = 1);
		this.sun = this.createSun(scene);
		this.light = this.createLight(scene);
	}

	abstract createGround(scene: babylon.Scene): babylon.Mesh;

	abstract createLimits(scene: babylon.Scene): babylon.Mesh[];

	abstract createLight(scene: babylon.Scene): babylon.DirectionalLight;

	abstract createSun(scene: babylon.Scene): babylon.Mesh;

	abstract destroyRest(): void;

	destroy(): void {
		this.ground.dispose();
		for (let i = 0; i < this.limits.length; i++) {
			this.limits[i].dispose();
		}
		this.sun.dispose();
		this.light.dispose();
		this.destroyRest();
	}
}