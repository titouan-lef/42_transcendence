import * as babylon from "/babylonjs/core/index.js";
import { MapOption } from "../gameSettings.js";

export abstract class MapTemplate {
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
		this.groundPhysic = new babylon.PhysicsAggregate(this.ground, babylon.PhysicsShapeType.BOX, { mass: 0 }, scene);
		this.ground.renderingGroupId = 1;
		this.limits = this.createLimits(scene);
		this.limits.forEach(limit => limit.renderingGroupId = 1);
		this.limits.forEach(limit => this.setLimitPhysic(scene, limit));
		this.sun = this.createSun(scene);
		this.light = this.createLight(scene);
	}

	setLimitPhysic(scene: babylon.Scene, limit: babylon.Mesh): void {
		const limitPhysic = new babylon.PhysicsAggregate(limit, babylon.PhysicsShapeType.BOX, { mass: 0, restitution: 1 }, scene);
		this.limitsPhysic.push(limitPhysic);
	}

	abstract createGround(scene: babylon.Scene): babylon.Mesh;

	abstract createLimits(scene: babylon.Scene): babylon.Mesh[];

	abstract createLight(scene: babylon.Scene): babylon.DirectionalLight;

	abstract createSun(scene: babylon.Scene): babylon.Mesh;

	abstract destroyRest(): void;

	destroy(): void {
		this.destroyRest();
		this.groundPhysic.dispose();
		this.ground.dispose();
		for (let i = 0; i < this.limits.length; i++) {
			this.limitsPhysic[i].dispose();
			this.limits[i].dispose();
		}
		this.sun.dispose();
		this.light.dispose();
	}
}