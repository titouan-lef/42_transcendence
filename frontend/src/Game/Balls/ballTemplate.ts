import * as babylon from "/babylonjs/core/index.js";
import { BallOption } from "../gameSettings.js";
import { BALL_DIAMETER } from "../values.js";

export abstract class BallTemplate {
	protected readonly mesh: babylon.Mesh;
	private readonly type: BallOption;
	protected readonly physic: babylon.PhysicsAggregate;

	constructor(scene: babylon.Scene, type: BallOption) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.mesh.position.y = BALL_DIAMETER / 2;
		this.physic = this.setPhysic(scene);
		this.mesh.renderingGroupId = 1;
		this.type = type;
	}

	setPhysic(scene: babylon.Scene): babylon.PhysicsAggregate {
		const physic = new babylon.PhysicsAggregate(this.mesh, babylon.PhysicsShapeType.SPHERE, {
			mass: 1,
			friction: 0.2, // freinage
			restitution: 0.8 // rebond
		}, scene);
		return physic;
	}
	
	/**@todo remove */
	testfunction(value: number): void {
		this.mesh.scaling.y = value;
	}

	/**@todo remove */
	testMove(): void {
		this.physic.body.applyImpulse(
			new babylon.Vector3(30, 0, 30),
			this.mesh.absolutePosition
		);
	}

	destroy(): void {
		this.destroyRest();
		this.physic.dispose();
		this.mesh.dispose();
	}

	abstract setMaterial(scene: babylon.Scene): void;

	abstract activateEffet(): void;
	
	abstract destroyRest(): void;
}