import * as babylon from "@babylonjs/core";
import { BallOption } from "../GameSettings.js";
import { BALL_DIAMETER, TRAIL_CREATION_INTERVAL, BALL_ANGULAR_FORCE, BALL_ANGULAR_INTERVAL, COLORS } from "../values.js";
import { BallTrail } from "./BallTrail.js";

export abstract class BallTemplate {
	protected readonly mesh: babylon.Mesh;
	protected readonly physic: babylon.PhysicsAggregate;
	private readonly type: BallOption;
	protected color: babylon.Color3;
	protected readonly ballTrails: BallTrail[] = [];
	protected readonly collisionParticles: babylon.ParticleSystem[] = [];
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
		this.color = COLORS.white;
		this.canSpin = spin;
		this.mesh.position.y = BALL_DIAMETER / 2;
		this.physic = this.setPhysic(scene);
		this.physic.body.setCollisionCallbackEnabled(true);
		this.mesh.renderingGroupId = 1;
		this.type = type;

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

	/** @todo refacto and maybe upgrade */
	/** particles on collides */
	createCollisionParticles(scene: babylon.Scene, collisionPoint: babylon.Vector3): babylon.ParticleSystem {
		const collisionParticles = new babylon.ParticleSystem("collisionParticles", 2000, scene);

		// Texture (étincelles)
		collisionParticles.particleTexture = new babylon.Texture("textures/sparks.png", scene);

		// Forme d’émission : sphère autour du point de collision
		collisionParticles.emitter = collisionPoint;
		collisionParticles.createSphereEmitter(BALL_DIAMETER * 2); // plus grand pour un effet “explosif”
		collisionParticles.renderingGroupId = 1;

		// Couleurs de départ / fin
		collisionParticles.color1 = new babylon.Color4(this.color.r, this.color.g, this.color.b, 1.0);
		collisionParticles.color2 = new babylon.Color4(1, 0.6, 0.1, 1.0); // plus chaud
		collisionParticles.colorDead = new babylon.Color4(0.2, 0.2, 0.2, 0.0);

		// Taille et vie
		collisionParticles.minSize = 0.05;
		collisionParticles.maxSize = 0.3;
		collisionParticles.minLifeTime = 0.2;
		collisionParticles.maxLifeTime = 0.2;

		// Vitesse et directions
		collisionParticles.emitRate = 2000;
		collisionParticles.minEmitPower = 6;
		collisionParticles.maxEmitPower = 12;
		collisionParticles.direction1 = new babylon.Vector3(-1, -1, -1);
		collisionParticles.direction2 = new babylon.Vector3(1, 1, 1);
		collisionParticles.updateSpeed = 0.01;

		// Gravité légère pour un effet “retombée”
		collisionParticles.gravity = new babylon.Vector3(0, -3, 0);

		return collisionParticles;
	}

	private showParticles(collisionPoint: null | babylon.Vector3, scene: babylon.Scene): void {
		if (collisionPoint === null)
			return ;
		const collisionParticle = this.createCollisionParticles(scene, collisionPoint);
		this.collisionParticles.push(collisionParticle);
		collisionParticle.start();
		setTimeout( () => {
			collisionParticle.stop(); // could stack particles but the point wont last too long
		}, 20);
	}

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
				this.showParticles(collisionEvent.point, this.mesh.getScene());
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
		this.collisionParticles.forEach(particle => {
			particle.stop();
			particle.dispose(); // just in case
		});
		while (this.collisionParticles.length)
			this.collisionParticles.splice(0, 1);
		this.mesh.material?.dispose();
		this.mesh.dispose();
	}

	abstract setMaterial(scene: babylon.Scene, color: babylon.Color3): void;

	abstract activateEffect(): void;

	abstract destroyRest(): void;
}
