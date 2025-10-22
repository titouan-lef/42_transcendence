import * as babylon from "/babylonjs/core/index.js";
import { BallOption, GameSettings } from "../gameSettings.js";
import { BALL_DIAMETER, TRAIL_CREATION_INTERVAL } from "../values.js";
import { BallTrail } from "./ballTrail.js";

export abstract class BallTemplate {
	protected readonly mesh: babylon.Mesh;
	protected readonly physic: babylon.PhysicsAggregate;
	private readonly type: BallOption;
	protected readonly ballTrails: BallTrail[] = [];
	private readonly collisionObservable: babylon.Observable<babylon.IPhysicsCollisionEvent>;
	private readonly collisionObserver: babylon.Observer<babylon.IPhysicsCollisionEvent>;
	private isInGoal: "player1" | "player2" | null = null;
	protected justCollided = false;
	protected realDirection: babylon.Vector3;
	private readonly spin;
	protected readonly sceneObservable: babylon.Observable<babylon.Scene>;
	protected readonly sceneObserver: babylon.Observer<babylon.Scene>;

	constructor(scene: babylon.Scene, type: BallOption, spin: boolean) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.spin = spin;
		this.mesh.position.y = BALL_DIAMETER / 2;
		this.physic = this.setPhysic(scene);
		this.physic.body.setCollisionCallbackEnabled(true);
		this.mesh.renderingGroupId = 1;
		this.type = type;

		this.mesh.metadata = { type: "collider" };
		this.collisionObservable = this.physic.body.getCollisionObservable();
		this.collisionObserver = this.checkIfBallIsInGoal();

		this.physic.body.setLinearVelocity(new babylon.Vector3((Math.random()  * 2 - 1) * 30, 0, (Math.random()  * 2 - 1) * 30));
		this.realDirection = this.physic.body.getLinearVelocity();

		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.applyMovementChanges();
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

	/** Spin doesn't apply to snake ball for obvious reasons */
	protected applyMovementChanges(): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			/**@todo Spin Effect */
		});
		return sceneObserver;
	}

	private checkIfBallIsInGoal(): babylon.Observer<babylon.IPhysicsCollisionEvent> {
		const collisionObserver = this.collisionObservable.add((collisionEvent) => {
			const metadata = collisionEvent.collidedAgainst.transformNode.metadata;
			if (!metadata)
				return;
			if (metadata.type === "goal")
				this.isInGoal = metadata.player === 1 ? "player1" : "player2";
			if (metadata.type === "collider")
				this.justCollided = true;
		});
		return collisionObserver;
	}

	/**@todo To remove */
	setJustCollide(): void {
		this.justCollided = true;
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
		this.collisionObservable.remove(this.collisionObserver);
		this.sceneObservable.remove(this.sceneObserver);
		this.physic.dispose();
		this.mesh.material?.dispose();
		this.mesh.dispose();
	}

	abstract setMaterial(scene: babylon.Scene, color: babylon.Color3): void;

	abstract activateEffet(): void;
	
	abstract destroyRest(): void;
}