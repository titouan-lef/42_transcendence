import * as babylon from "/babylonjs/core/index.js";
import { BallOption } from "../gameSettings.js";
import { BALL_DIAMETER } from "../values.js";

export abstract class BallTemplate {
	protected readonly mesh: babylon.Mesh;
	protected readonly type: BallOption;

	constructor(scene: babylon.Scene, type: BallOption) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		/**@todo this.mesh.position.y = BALL_DIAMETER / 2 instead of falling ball below */
		this.mesh.position.y = 10;
		const sphereAggregate = new babylon.PhysicsAggregate(this.mesh, babylon.PhysicsShapeType.SPHERE, { mass: 1, restitution:0.75 }, scene);
		
		this.mesh.renderingGroupId = 1;
		this.type = type;
	}

	abstract activateEffet(): void;

	testfunction(value: number): void {
		this.mesh.scaling.y = value;
	}

	abstract destroyRest(): void;

	destroy(): void {
		this.mesh.dispose();
		this.destroyRest();
	}
}