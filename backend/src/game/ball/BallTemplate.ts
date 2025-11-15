import * as babylon from "@babylonjs/core";
import { BallOption } from "../settings/GameSettings.js";
import { BALL_DIAMETER, BALL_ANGULAR_FORCE, BALL_ANGULAR_INTERVAL, NERF_SPEED_FACTOR, MAX_SPEED, START_TIMEOUT } from "../settings/values.js";
import { Position } from "../../web_sockets/types_transfert.js";

export abstract class BallTemplate {

	private readonly type: BallOption;
	protected readonly physic: babylon.PhysicsAggregate;
	private readonly collisionObservable: babylon.Observable<babylon.IPhysicsCollisionEvent>;
	private readonly collisionObserver: babylon.Observer<babylon.IPhysicsCollisionEvent>;
	private isInGoal: "player1" | "player2" | null = null;
	private goalPosition: babylon.Vector3 | null = null;
	protected justCollided = false;
	protected realDirection: babylon.Vector3;
	private spinningLeft = false;
	private spinningRight = false;
	protected force = BALL_ANGULAR_FORCE;
	protected forceDirection = -1;
	protected readonly sceneObservable: babylon.Observable<babylon.Scene>;
	protected readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly yObservable: babylon.Observable<babylon.Scene>;
	private readonly yObserver: babylon.Observer<babylon.Scene>;

	protected readonly mesh: babylon.Mesh;
	protected gameStopped = true;

	constructor(scene: babylon.Scene, type: BallOption) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.type = type;
		this.mesh.metadata = { type: "collider", pushable: true };
		this.mesh.renderingGroupId = 1;
		// this.color = color;
		// this.textures = textures;
		// this.setMaterial(scene);
		this.physic = this.setPhysic(scene);
		
		this.physic.body.setCollisionCallbackEnabled(true);
		this.collisionObservable = this.physic.body.getCollisionObservable();
		this.collisionObserver = this.checkBallCollision();

		this.yObservable = scene.onAfterPhysicsObservable;
		this.yObserver = this.blockVelocityY();
		
		this.realDirection = this.physic.body.getLinearVelocity();
		
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.applyMovementChanges();
		// if (BALL_TRAIL_ON)
		// 	this.trailIntervalId = this.setTrail(scene);
	}

	/**block the ball from having a Y velocity */
	private blockVelocityY(): babylon.Observer<babylon.Scene> {
		const yObserver = this.yObservable.add(() => {
			const velocity = this.physic.body.getLinearVelocity();
			if (velocity) {
				velocity.y = 0;
				this.physic.body.setLinearVelocity(velocity);
			}
		});
		return yObserver;
	}

	/**launch ball */
	launchBall(): void {
		const startingDirection = Math.random() < 0.5 ? 1 : -1;
		this.physic.body.setLinearVelocity(new babylon.Vector3(startingDirection * 30, 0, 0));
		this.justCollided = true;
		this.gameStopped = false;
	}

	// private setMaterial(scene: babylon.Scene): void {
	// 	const material = new babylon.StandardMaterial('ballcolor', scene);
	// 	material.emissiveColor = this.color;
	// 	this.mesh.material = material;
	// }

	private setPhysic(scene: babylon.Scene): babylon.PhysicsAggregate {
		const physic = new babylon.PhysicsAggregate(this.mesh, babylon.PhysicsShapeType.SPHERE, {
			mass: 1,
			restitution: 0, // 0 so it always take the restitution of the object it hits
			friction: 0 
		}, scene);
		return physic;
	}

	/** Spin doesn't apply to snake ball for obvious reasons */
	protected applyMovementChanges(): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			this.mesh.position.y = BALL_DIAMETER / 2; // resets ball position.y (only visual)
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
				// this.showParticles(collisionEvent.point, this.mesh.getScene(), "collision");
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
		if (this.checkSideHit(collisionEvent) === "spinEffect") {
			const collisionPointZ = collisionEvent.point?.z;
			if (collisionPointZ === undefined )
				return;
			if (collisionPointZ - collisionEvent.collidedAgainst.transformNode.position.z <= 0) // colliding right or left of the player
				this.spinningLeft = true;
			else
				this.spinningRight = true;
		} else {
			this.spinningLeft = false;
			this.spinningRight = false;
		}
	}

	private checkSideHit(collisionEvent: babylon.IPhysicsCollisionEvent): string {
		const playerMeshes = collisionEvent.collidedAgainst.transformNode.getChildMeshes();
		let nearestMesh = null;
		let minDist = Infinity;

		if (collisionEvent.point === null || collisionEvent.point === undefined)
			return "";
		for (const mesh of playerMeshes) {
			const dist = babylon.Vector3.Distance(mesh.getAbsolutePosition(), collisionEvent.point);
			if (dist < minDist) {
				minDist = dist;
				nearestMesh = mesh;
			}
		}
		if (nearestMesh && nearestMesh.metadata) {
			const face = nearestMesh.metadata.face;
			return face;
		}
		return "";
	}

	/** damp ball if too fast */
	protected nerfSpeed(): void {
		const velocity = this.physic.body.getLinearVelocity();
		const speed = velocity.length();
		let dampingFactor = 0;

		if (speed > MAX_SPEED) {
			const excessRatio = (speed - MAX_SPEED) / speed; // between 0 and 1
			dampingFactor = excessRatio * NERF_SPEED_FACTOR;
		}
		this.physic.body.setLinearDamping(dampingFactor);
	}

	/** hides ball on goal and stop intervals */
	preDeath(): void {
		this.mesh.visibility = 0;
		this.gameStopped = true;
		this.destroyRest();
	}

	/** Spawn particules */
	// showParticles(collisionPoint: null | babylon.Vector3, scene: babylon.Scene, type: ParticlesType): void {
	// 	if (collisionPoint === null)
	// 		return ;
	// 	let particle: babylon.ParticleSystem;
	// 	switch (type) {
	// 		case "collision":
	// 			particle = this.createCollisionParticles(scene, collisionPoint);
	// 			break;
	// 		case "explosion":
	// 			particle = this.createExplosionParticles(scene, collisionPoint);
	// 			break;
	// 		case "impulse":
	// 			particle = this.createImpulseParticles(scene, collisionPoint);
	// 			break;
	// 		default: 
	// 			throw new Error("Particle not known") ;
	// 	}
	// 	this.particles.push(particle);
	// 	particle.start();
	// 	setTimeout( () => {
	// 		particle?.stop();
	// 		const index = this.particles?.indexOf(particle);
	// 		particle?.dispose();
	// 		if (index !== -1)
	// 			this.particles?.splice(index, 1);
	// 	}, 2000);
	// }

	setJustCollide(): void {
		this.justCollided = true;
	}

	/** @todo Titouan gaming */
	getGoal(): { goal: "player1" | "player2" | null, position: babylon.Vector3 | null } {
		const goal = this.isInGoal;
		const position = this.goalPosition;
		return { goal, position };
	}

	getPosition(): Position {
		return { x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z };
	}

	getType(): BallOption {
		return this.type;
	}

	/**debug function*/
	moveBall(): void {
		this.physic.body.applyImpulse(
			new babylon.Vector3(25, 0, 0),
			this.mesh.position
		);
	}

	destroy(): void {
		this.destroyRest();
		this.collisionObservable.remove(this.collisionObserver);
		this.sceneObservable.remove(this.sceneObserver);
		this.yObservable.remove(this.yObserver);
		// while (this.ballTrails.length) {
		// 	this.ballTrails[0].destroy();
		// 	this.ballTrails.splice(0, 1);
		// }
		this.physic?.dispose();
		// this.particles.forEach(particle => {
		// 	particle.stop();
		// 	particle.particleTexture?.dispose();
		// 	particle.dispose();
		// });
		// while (this.particles.length)
		// 	this.particles.splice(0, 1);
		this.mesh?.material?.dispose();
		this.mesh?.dispose();
	}

	abstract activateEffect(): void;

	abstract destroyRest(): void;
}
