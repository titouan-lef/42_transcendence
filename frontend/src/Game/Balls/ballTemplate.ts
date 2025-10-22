import * as babylon from "/babylonjs/core/index.js";
import { BallOption } from "../gameSettings.js";
import { BALL_DIAMETER, TRAIL_CREATION_INTERVAL } from "../values.js";
import { BallTrail } from "./ballTrail.js";

export abstract class BallTemplate {
	protected readonly mesh: babylon.Mesh;
	protected readonly physic: babylon.PhysicsAggregate;
	private readonly type: BallOption;
	protected readonly ballTrails: BallTrail[] = [];
	private readonly observable: babylon.Observable<babylon.IPhysicsCollisionEvent>;
	private isInGoal: "player1" | "player2" | null = null;

	constructor(scene: babylon.Scene, type: BallOption) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.mesh.position.y = BALL_DIAMETER / 2;
		this.physic = this.setPhysic(scene);
		this.physic.body.setCollisionCallbackEnabled(true);
		this.mesh.renderingGroupId = 1;
		this.type = type;
		this.observable = this.checkIfBallIsInGoal();
	}

	private setPhysic(scene: babylon.Scene): babylon.PhysicsAggregate {
		const physic = new babylon.PhysicsAggregate(this.mesh, babylon.PhysicsShapeType.SPHERE, {
			mass: 1,
			restitution: 1 // rebond
		}, scene);
		return physic;
	}

	protected setTrail(scene: babylon.Scene, color: babylon.Color3): ReturnType<typeof setInterval> {
		const trailIntervalId = setInterval(() => {
			this.ballTrails.push(new BallTrail(scene, this.mesh.absolutePosition, color));
			while (this.ballTrails.length && this.ballTrails[0].hasDisappeared()) {
				this.ballTrails.splice(0, 1);
			}
		}, TRAIL_CREATION_INTERVAL);
		return trailIntervalId;
	}

	private checkIfBallIsInGoal(): babylon.Observable<babylon.IPhysicsCollisionEvent> {
		const observable = this.physic.body.getCollisionObservable();
		observable.add((collisionEvent) => {
			const metadata = collisionEvent.collidedAgainst.transformNode.metadata;
			if (!metadata)
				return;
			if (metadata.type === "goal") {
				this.isInGoal = metadata.player === 1 ? "player1" : "player2";
			}
		});
		return observable;
	}

	getGoal(): "player1" | "player2" | null {
		return this.isInGoal;
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
		while (this.ballTrails.length) {
			this.ballTrails[0].destroy();
			this.ballTrails.splice(0, 1);
		}
		this.observable.clear();
		this.physic.dispose();
		this.mesh.material?.dispose();
		this.mesh.dispose();
	}

	abstract setMaterial(scene: babylon.Scene, color: babylon.Color3): void;

	abstract activateEffet(): void;
	
	abstract destroyRest(): void;
}