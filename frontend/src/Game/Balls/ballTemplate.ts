import * as babylon from "/babylonjs/core/index.js";
import { BallOption } from "../gameSettings.js";
import { BALL_DIAMETER } from "../values.js";

export abstract class BallTemplate {
	protected readonly mesh: babylon.Mesh;
	private readonly type: BallOption;
	protected readonly physic: babylon.PhysicsAggregate;
	isInGoalp1 = false;
	isInGoalp2 = false;

	constructor(scene: babylon.Scene, type: BallOption) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.mesh.position.y = BALL_DIAMETER / 2;
		this.physic = this.setPhysic(scene);
		this.physic.body.setCollisionCallbackEnabled(true);
		this.mesh.renderingGroupId = 1;
		this.type = type;
		this.checkIfBallIsInGoal();
	}

	setPhysic(scene: babylon.Scene): babylon.PhysicsAggregate {
		const physic = new babylon.PhysicsAggregate(this.mesh, babylon.PhysicsShapeType.SPHERE, {
			mass: 1,
			restitution: 1 // rebond
		}, scene);
		return physic;
	}

	private checkIfBallIsInGoal(): void {
		const observable = this.physic.body.getCollisionObservable();
		const observer = observable.add((collisionEvent) => {
			if (collisionEvent.collidedAgainst.transformNode.name === "goalplayer1") {
				this.isInGoalp1 = true;
			}
			if (collisionEvent.collidedAgainst.transformNode.name === "goalplayer2") {
				this.isInGoalp2 = true;
			}
		});
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