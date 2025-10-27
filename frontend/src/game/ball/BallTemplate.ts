import * as babylon from "@babylonjs/core";
import { BallOption } from "../GameSettings.js";
import { BALL_DIAMETER, TRAIL_CREATION_INTERVAL, BALL_ANGULAR_FORCE, BALL_ANGULAR_INTERVAL, TRICKY_BALL_EFFECT_FORCE } from "../values.js";
import { BallTrail } from "./BallTrail.js";

export abstract class BallTemplate {
	protected readonly mesh: babylon.Mesh;
	protected readonly physic: babylon.PhysicsAggregate;
	private readonly type: BallOption;
	protected readonly ballTrails: BallTrail[] = [];
	//protected readonly collisionParticles: babylon.ParticleSystem;
	private readonly collisionObservable: babylon.Observable<babylon.IPhysicsCollisionEvent>;
	private readonly collisionObserver: babylon.Observer<babylon.IPhysicsCollisionEvent>;
	private isInGoal: "player1" | "player2" | null = null;
	private goalPosition: babylon.Vector3 | null = null;
	protected justCollided = false;
	protected realDirection: babylon.Vector3;

	private readonly canSpin;
	private spinningLeft = false;
	private spinningRight = false;
	protected force = BALL_ANGULAR_FORCE;
	protected forceDirection = -1;
	protected readonly sceneObservable: babylon.Observable<babylon.Scene>;
	protected readonly sceneObserver: babylon.Observer<babylon.Scene>;

	private readonly hitPoints: number[] = [];

	constructor(scene: babylon.Scene, type: BallOption, spin: boolean) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.canSpin = spin;
		this.mesh.position.y = BALL_DIAMETER / 2;
		this.physic = this.setPhysic(scene);
		this.physic.body.setCollisionCallbackEnabled(true);
		this.mesh.renderingGroupId = 1;
		this.type = type;
		//this.collisionParticles = this.createCollisionParticles(scene);

		this.mesh.metadata = { type: "collider" };
		this.collisionObservable = this.physic.body.getCollisionObservable();
		this.collisionObserver = this.checkBallCollision();

		//this.physic.body.setLinearVelocity(new babylon.Vector3((Math.random()  * 2 - 1) * 30, 0, (Math.random()  * 2 - 1) * 30));
		this.realDirection = this.physic.body.getLinearVelocity();

		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.applyMovementChanges();
	}

	private setPhysic(scene: babylon.Scene): babylon.PhysicsAggregate {
		const physic = new babylon.PhysicsAggregate(this.mesh, babylon.PhysicsShapeType.SPHERE, {
			mass: 1,
			restitution: 0, // 0 so it always take the restitution of the object it hits
			friction: 0 
		}, scene);
		return physic;
	}

	protected setTrail(scene: babylon.Scene, color: babylon.Color3): ReturnType<typeof setInterval> {
		const trailIntervalId = setInterval(() => {
			this.ballTrails.push(new BallTrail(scene, this.mesh.position, color));
			while (this.ballTrails.length && this.ballTrails[0].hasDisappeared()) {
				this.ballTrails.splice(0, 1);
			}
		}, TRAIL_CREATION_INTERVAL);
		return trailIntervalId;
	}

	/** Spin doesn't apply to snake ball for obvious reasons */
	protected applyMovementChanges(): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			this.mesh.position.y = BALL_DIAMETER / 2;
			if (this.justCollided) {
				this.realDirection = this.physic.body.getLinearVelocity();
				this.justCollided = false;
				this.forceDirection = -1;
				this.force = BALL_ANGULAR_FORCE;
			}
			if (this.force <= 0)
				this.forceDirection *= -1;
			this.force -= (BALL_ANGULAR_FORCE / BALL_ANGULAR_INTERVAL) * this.forceDirection; // Angular interval is the number of step it will take to reach maximum value
			this.force = Math.max(this.force, BALL_ANGULAR_FORCE); // to deny force to go higher than BALL_ANGULAR_FORCE
			if (this.spinningLeft) {
				this.physic.body.applyForce(
					new babylon.Vector3(this.realDirection.z * this.force, 0, -this.realDirection.x * this.force),
					this.mesh.position
				);
			} else if (this.spinningRight) {
				this.physic.body.applyForce(
					new babylon.Vector3(-this.realDirection.z * this.force, 0, this.realDirection.x * this.force),
					this.mesh.position
				);
			}
		});
		return sceneObserver;
	}

	/** particles on collides */
	// createCollisionParticles(scene: babylon.Scene): babylon.ParticleSystem {
	// 	const collisionParticles = new babylon.ParticleSystem("collisionParticles", 200, scene);

	// 	// Texture (étincelles blanches)
	// 	collisionParticles.particleTexture = new babylon.Texture("textures/particle.png", scene);

	// 	// Forme d’émission : petite sphère
	// 	collisionParticles.createSphereEmitter(0.5);
	// 	collisionParticles.renderingGroupId = 2;

	// 	// Couleurs de départ / fin
	// 	collisionParticles.color1 = new babylon.Color4(1, 0.9, 0.4, 1.0);
	// 	collisionParticles.color2 = new babylon.Color4(1, 0.6, 0.1, 1.0);
	// 	collisionParticles.colorDead = new babylon.Color4(0.2, 0.2, 0.2, 0.0);

	// 	// Taille et vie des particules
	// 	collisionParticles.minSize = 0.05;
	// 	collisionParticles.maxSize = 0.2;
	// 	collisionParticles.minLifeTime = 0.3;
	// 	collisionParticles.maxLifeTime = 0.8;

	// 	// Vitesse
	// 	collisionParticles.emitRate = 1000;
	// 	collisionParticles.minEmitPower = 1.0;
	// 	collisionParticles.maxEmitPower = 3.0;
	// 	collisionParticles.updateSpeed = 0.01;

	// 	// Gravité légère
	// 	collisionParticles.gravity = new babylon.Vector3(0, -2, 0);
	// 	return collisionParticles;
	// }

	// private showParticles(collisionPoint: null | babylon.Vector3): void {
	// 	if (collisionPoint !== null)
	// 		this.collisionParticles.emitter = collisionPoint;
	// 	else
	// 		return ;
	// 	this.collisionParticles.start();
	// 	setInterval( () => {
	// 		this.collisionParticles.stop();
	// 	}, 2000);
	// }

	/**@todo refacto */
	private checkBallCollision(): babylon.Observer<babylon.IPhysicsCollisionEvent> {
		const collisionObserver = this.collisionObservable.add((collisionEvent) => {
			const metadata = collisionEvent.collidedAgainst.transformNode.metadata;
			if (!metadata)
				return;
			if (metadata.type === "goal") {
				this.isInGoal = metadata.player === 1 ? "player1" : "player2";
				this.goalPosition = collisionEvent.point;
			}
			if (metadata.type === "collider") {
				this.justCollided = true;
				//this.showParticles(collisionEvent.point);
				/** Effect */
				if (metadata?.playerSpinning) {
					const collisionPointZ = collisionEvent.point?.z;
					if (collisionPointZ === undefined ) // forced to do that because point can be null, but cant happen here
						return;
					switch (collisionPointZ - collisionEvent.collidedAgainst.transformNode.position.z <= 0) { // colliding right or left of the player
						case (true):
							this.spinningLeft = true;
							break;
						case (false):
							this.spinningRight = true;
							break;
						default: ;
					}
				} else{
					this.spinningLeft = false;
					this.spinningRight = false;
				}
				//
			}
		});
		return collisionObserver;
	}

	/**@todo To remove */
	setJustCollide(): void {
		this.justCollided = true;
	}

	/** @todo Titouan gaming */
	getGoal(): { goal: "player1" | "player2" | null, position: babylon.Vector3 | null } {
		const goal = this.isInGoal;
		const position = this.goalPosition;
		return { goal, position };
	}

	/**@todo remove */
	testMove(): void {
		this.physic.body.applyImpulse(
			new babylon.Vector3(25, 0, 0),
			this.mesh.position
		);
	}

	destroy(): void {
		this.destroyRest();
		while (this.ballTrails.length) {
			this.ballTrails[0].destroy();
			this.ballTrails.splice(0, 1);
		}
		while (this.hitPoints.length) {
			this.hitPoints.splice(0, 1);
		}
		this.collisionObservable.remove(this.collisionObserver);
		this.sceneObservable.remove(this.sceneObserver);
		this.physic.dispose();
		// this.collisionParticles.stop(); // in case
		// this.collisionParticles.dispose();
		this.mesh.material?.dispose();
		this.mesh.dispose();
	}

	abstract setMaterial(scene: babylon.Scene, color: babylon.Color3): void;

	abstract activateEffect(): void;

	abstract destroyRest(): void;
}
