import * as babylon from "@babylonjs/core";
import { BallOption } from "../GameSettings.js";
import { BALL_DIAMETER, TRAIL_CREATION_INTERVAL, BALL_ANGULAR_FORCE, BALL_ANGULAR_INTERVAL, COLORS, NERF_SPEED_FACTOR, MAX_SPEED } from "../values.js";
import { BallTrail } from "./BallTrail.js";
type ParticlesType = "explosion" | "collision" | "impulse";

export abstract class BallTemplate {
	protected readonly mesh: babylon.Mesh;
	protected readonly physic: babylon.PhysicsAggregate;
	private readonly type: BallOption;
	protected color: babylon.Color3;
	protected readonly ballTrails: BallTrail[] = [];
	protected readonly particles: babylon.ParticleSystem[] = [];
	private readonly collisionObservable: babylon.Observable<babylon.IPhysicsCollisionEvent>;
	private readonly collisionObserver: babylon.Observer<babylon.IPhysicsCollisionEvent>;
	private isInGoal: "player1" | "player2" | null = null;
	private goalPosition: babylon.Vector3 | null = null;
	protected justCollided = false;
	protected realDirection: babylon.Vector3;
	private readonly textures: Record<string, babylon.Texture>;

	private spinningLeft = false;
	private spinningRight = false;
	protected force = BALL_ANGULAR_FORCE;
	protected forceDirection = -1;
	protected readonly sceneObservable: babylon.Observable<babylon.Scene>;
	protected readonly sceneObserver: babylon.Observer<babylon.Scene>;

	private readonly hitPoints: number[] = [];

	constructor(scene: babylon.Scene, type: BallOption, textures: Record<string, babylon.Texture>) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.textures = textures;
		this.color = COLORS.white;
		this.mesh.position.y = BALL_DIAMETER / 2;
		this.physic = this.setPhysic(scene);
		this.physic.body.setCollisionCallbackEnabled(true);
		this.mesh.renderingGroupId = 1;
		this.type = type;

		this.mesh.metadata = { type: "collider", pushable: true };
		this.collisionObservable = this.physic.body.getCollisionObservable();
		this.collisionObserver = this.checkBallCollision();
		
		this.realDirection = this.physic.body.getLinearVelocity();
		
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.applyMovementChanges();
		/**@todo protect this against instaclose game */
		this.launchBall(scene);
	}

	/**launch ball */
	private launchBall(scene: babylon.Scene): void {
		setTimeout( () => {
			const random = Math.random();
			let startingDirection;
			if (random < 0.5)
				startingDirection = 1;
			else
				startingDirection = -1;
			this.physic.body.setLinearVelocity(new babylon.Vector3(startingDirection * 30, 0, 0));
			this.showParticles(this.mesh.position, scene, "impulse");
			this.justCollided = true;
		}, 1000);
	}

	private setPhysic(scene: babylon.Scene): babylon.PhysicsAggregate {
		const physic = new babylon.PhysicsAggregate(this.mesh, babylon.PhysicsShapeType.SPHERE, {
			mass: 1,
			restitution: 0, // 0 so it always take the restitution of the object it hits
			friction: 0 
		}, scene);
		return physic;
	}

	/** trail behind the ball */
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
			this.mesh.position.y = BALL_DIAMETER / 2; // resets ball position.y
			if (this.justCollided) {
				this.realDirection = this.physic.body.getLinearVelocity(); // remember original velocity, to apply movement changes on it
				this.justCollided = false; 
				this.forceDirection = -1; // reset forceDirection
				this.force = BALL_ANGULAR_FORCE; // reset angularForce
			}
			if (this.force <= 0)
				this.forceDirection *= -1;
			this.applyEffect();
			this.nerfSpeed();
		});
		return sceneObserver;
	}

	/** applies two contradictory forces on either side of the ball */
	private applyEffect(): void {
		this.force -= (BALL_ANGULAR_FORCE / BALL_ANGULAR_INTERVAL) * this.forceDirection; // Angular interval is the number of step it will take to reach maximum value
		this.force = Math.max(this.force, BALL_ANGULAR_FORCE); // to deny force to go higher than BALL_ANGULAR_FORCE
		if (this.spinningRight) {
			this.physic.body.applyForce(
				new babylon.Vector3(this.realDirection.z * this.force, 0, -this.realDirection.x * this.force),
				this.mesh.position
			);
		} else if (this.spinningLeft) {
			this.physic.body.applyForce(
				new babylon.Vector3(-this.realDirection.z * this.force, 0, this.realDirection.x * this.force),
				this.mesh.position
			);
		}
	}

	/** particles on collides */
	private createCollisionParticles(scene: babylon.Scene, position: babylon.Vector3): babylon.ParticleSystem {
		const collisionParticles = new babylon.ParticleSystem("collision", 300, scene);
		collisionParticles.particleTexture = this.textures.spark.clone();
		collisionParticles.emitter = position;
		collisionParticles.createSphereEmitter(BALL_DIAMETER * 2);
		collisionParticles.renderingGroupId = 1;
		collisionParticles.color1 = new babylon.Color4(this.color.r, this.color.g, this.color.b, 1.0);
		collisionParticles.colorDead = new babylon.Color4(this.color.r, this.color.g, this.color.b, 1.0);
		collisionParticles.minSize = 0.3;
		collisionParticles.maxSize = 0.3;
		collisionParticles.minLifeTime = 0.2;
		collisionParticles.maxLifeTime = 0.2;
		collisionParticles.emitRate = 300;
		collisionParticles.minEmitPower = 6;
		collisionParticles.maxEmitPower = 12;
		collisionParticles.emitRate = 0;
		collisionParticles.manualEmitCount = 200;
		return collisionParticles;
	}

	/** particles on goal */
	private createExplosionParticles(scene: babylon.Scene, position: babylon.Vector3): babylon.ParticleSystem {
		const explosionParticles = new babylon.ParticleSystem("explosion", 200, scene);
		explosionParticles.particleTexture = this.textures.flare.clone();
		explosionParticles.emitter = position;
		explosionParticles.createSphereEmitter(BALL_DIAMETER * 10);
		explosionParticles.renderingGroupId = 1;
		explosionParticles.color1 = new babylon.Color4(1, 0.5, 0, 1);
		explosionParticles.color2 = new babylon.Color4(1, 0.2, 0, 1);
		explosionParticles.colorDead = new babylon.Color4(0, 0, 0, 0);
		explosionParticles.minSize = 5;
		explosionParticles.maxSize = 10;
		explosionParticles.minEmitPower = 5;
		explosionParticles.maxEmitPower = 15;
		explosionParticles.updateSpeed = 0.02;
		
		//does a burst
		explosionParticles.emitRate = 0;
		explosionParticles.manualEmitCount = 200;
		return explosionParticles;
	}

	/** particles on impulses */
	protected createImpulseParticles(scene: babylon.Scene, position: babylon.Vector3): babylon.ParticleSystem {
		const explosionParticles = new babylon.ParticleSystem("impulse", 100, scene);
		explosionParticles.particleTexture = this.textures.flare.clone();
		explosionParticles.emitter = position;
		explosionParticles.createSphereEmitter(BALL_DIAMETER * 2);
		explosionParticles.renderingGroupId = 1;
		explosionParticles.color1 = new babylon.Color4(this.color.r, this.color.g, this.color.b, 1.0);
		explosionParticles.minSize = 3;
		explosionParticles.maxSize = 3;
		explosionParticles.minEmitPower = 2;
		explosionParticles.maxEmitPower = 4;
		explosionParticles.updateSpeed = 0.02;

		// does a burst
		explosionParticles.emitRate = 0;
		explosionParticles.manualEmitCount = 100;
		return explosionParticles;
	}

	/**@todo refacto */
	private checkBallCollision(): babylon.Observer<babylon.IPhysicsCollisionEvent> {
		const collisionObserver = this.collisionObservable.add((collisionEvent) => {
			const metadata = collisionEvent.collidedAgainst.transformNode.metadata;
			if (!metadata)
				return;
			//if has a metadata (ground doesn t have one)
			if (metadata.type === "goal") {
				this.isInGoal = metadata.player === 1 ? "player1" : "player2";
				this.goalPosition = collisionEvent.point;
			}
			if (metadata.type === "collider") {
				this.justCollided = true;
				this.showParticles(collisionEvent.point, this.mesh.getScene(), "collision");
				this.checkSpin(collisionEvent);
			}
		});
		return collisionObserver;
	}

	/** check if the player has the spinEffect and change the spinning boolean of the ball if so */
	private checkSpin(collisionEvent: babylon.IPhysicsCollisionEvent) : void {
		const metadata = collisionEvent.collidedAgainst.transformNode.metadata;
		if (!metadata)
			return;
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
	}

	/** damp ball if too fast */
	protected nerfSpeed(): void {
		const velocity = this.physic.body.getLinearVelocity();
		const speed = velocity.length();

		if (speed > MAX_SPEED) {
			const excessRatio = (speed - MAX_SPEED) / speed; // between 0 and 1
			const dampingFactor = excessRatio * NERF_SPEED_FACTOR;
			this.physic.body.setLinearDamping(dampingFactor);
		} else {
			this.physic.body.setLinearDamping(0);
		}
	}

	/** hides ball on goal and stop intervals */
	preDeath(): void {
		this.mesh.visibility = 0;
		this.destroyRest(); // stops intervals
	}

	/** Spawn particules */
	showParticles(collisionPoint: null | babylon.Vector3, scene: babylon.Scene, type: ParticlesType): void {
		if (collisionPoint === null)
			return ;
		let particle: babylon.ParticleSystem;
		switch (type) {
			case "collision":
				particle = this.createCollisionParticles(scene, collisionPoint);
				break;
			case "explosion":
				particle = this.createExplosionParticles(scene, collisionPoint);
				break;
			case "impulse":
				particle = this.createImpulseParticles(scene, collisionPoint);
				break;
			default: 
				return ;
		}
		this.particles.push(particle);
		particle.start();
		setTimeout( () => {
			particle?.stop();
			const index = this.particles.indexOf(particle);
			particle?.dispose();
			if (index !== -1) // protection in case destroy() and the end of timeOut occur at the same time
				this.particles.splice(index, 1);
		}, 2000);
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
		this.collisionObservable.remove(this.collisionObserver);
		this.sceneObservable.remove(this.sceneObserver);
		while (this.ballTrails.length) {
			this.ballTrails[0].destroy();
			this.ballTrails.splice(0, 1);
		}
		while (this.hitPoints.length) {
			this.hitPoints.splice(0, 1);
		}
		this.physic?.dispose();
		this.particles.forEach(particle => {
			particle?.stop();
			particle?.dispose();
		});
		while (this.particles.length)
			this.particles.splice(0, 1);
		this.mesh?.material?.dispose();
		this.mesh?.dispose();
	}

	abstract setMaterial(scene: babylon.Scene, color: babylon.Color3): void;

	abstract activateEffect(): void;

	abstract destroyRest(): void;
}
