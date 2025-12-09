import * as babylon from "@babylonjs/core";
import { BallOption, GameSettings } from "../settings/GameSettings.js";
import { BALL_DIAMETER, BALL_ANGULAR_FORCE, BALL_ANGULAR_INTERVAL, NERF_SPEED_FACTOR, MAX_SPEED, UNSTUCK_TIMER, COLORS3, PLAYER_STUN_DURATION, MIN_SPEED, BUFF_SPEED_INTERVAL, INCREASE_GENERAL_SPEED_INTERVAL } from "../settings/values.js";
import { EventMessage, ParticlesType, Position, Status } from "../web_sockets/types_transfert.js";
import { WebSocket } from "ws";
import { vec3ToPos } from "../utils.js";

abstract class BallTemplate {
	protected readonly mesh: babylon.Mesh;
	private readonly type: BallOption;
	protected particleColor: babylon.Color3 = COLORS3.black;
	protected readonly physic: babylon.PhysicsAggregate;
	private readonly collisionObservable: babylon.Observable<babylon.IPhysicsCollisionEvent>;
	private readonly collisionObserver: babylon.Observer<babylon.IPhysicsCollisionEvent>;
	protected isInGoal: "player1" | "player2" | null = null;
	protected justCollided = false;
	protected realDirection: babylon.Vector3;
	protected force = BALL_ANGULAR_FORCE;
	protected readonly sockets: WebSocket[];
	protected readonly sceneObservable: babylon.Observable<babylon.Scene>;
	protected readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private readonly yObservable: babylon.Observable<babylon.Scene>;
	private readonly yObserver: babylon.Observer<babylon.Scene>;
	protected gameStopped = true;
	private readonly originalMaxSpeed;
	private readonly originalMinSpeed;
	protected speedIncreaseFactor = 1;
	
	private spinningRight = false;
	private spinningLeft = false;
	protected forceDirection = -1;
	private unstuckTimer = 0;
	private particleCooldown = 0;
	private buffSpeedTimer = 0;
	protected effectInterval = 0;
	protected maxSpeed;
	private minSpeed;
	private increaseMaxMinSpeedTimer = 0;

	constructor(scene: babylon.Scene, type: BallOption, sockets: WebSocket[], settings: GameSettings) {
		this.mesh = babylon.MeshBuilder.CreateSphere(type + "ball", { diameter: BALL_DIAMETER, segments: 32 }, scene);
		this.type = type;
		this.mesh.position.y = BALL_DIAMETER / 2;
		this.mesh.metadata = { type: "collider", pushable: true, windAffected: settings.options.windAffectsBall };
		this.originalMaxSpeed = MAX_SPEED * ((!settings.options.rotatingPlayer && !settings.options.spin) ? 1.3 : 1);
		this.originalMinSpeed = MIN_SPEED * ((!settings.options.rotatingPlayer && !settings.options.spin) ? 1 : -1);
		this.maxSpeed = this.originalMaxSpeed;
		this.minSpeed = this.originalMinSpeed;
		this.sockets = sockets;
		this.physic = this.setPhysic(scene);
		
		this.physic.body.setCollisionCallbackEnabled(true);
		this.collisionObservable = this.physic.body.getCollisionObservable();
		this.collisionObserver = this.checkBallCollision(sockets);

		this.yObservable = scene.onAfterPhysicsObservable;
		this.yObserver = this.blockVelocityY();

		this.realDirection = this.physic.body.getLinearVelocity();
		
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.observeScene(scene);
	}

	/**block the ball from having a Y velocity */
	private blockVelocityY(): babylon.Observer<babylon.Scene> {
		const yObserver = this.yObservable.add(() => {
			const velocity = this.physic.body.getLinearVelocity();
			if (!velocity)
				return;
			velocity.y = 0;
			this.physic.body.setLinearVelocity(velocity);
		});
		return yObserver;
	}
	private setPhysic(scene: babylon.Scene): babylon.PhysicsAggregate {
		const physic = new babylon.PhysicsAggregate(this.mesh, babylon.PhysicsShapeType.SPHERE, {
			mass: 1,
			restitution: 0, // 0 so it always take the restitution of the object it hits
			friction: 0 
		}, scene);
		return physic;
	}

	/** Spin doesn't apply to snake ball for obvious reasons */
	protected observeScene(scene: babylon.Scene): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			this.mesh.position.y = BALL_DIAMETER / 2; // resets ball position.y (only visual but will be sent to front)
			if (this.gameStopped)
				return;
			this.increaseMaxMinSpeedTimer += scene.metadata.gameSpeed;
			if (this.increaseMaxMinSpeedTimer >= INCREASE_GENERAL_SPEED_INTERVAL) {
				this.increaseMaxMinSpeedTimer -= INCREASE_GENERAL_SPEED_INTERVAL;
				this.maxSpeed += this.speedIncreaseFactor;
				this.minSpeed += this.speedIncreaseFactor;
			}
			if (this.particleCooldown > 0)
				this.particleCooldown--;
			this.unstuckTimer += scene.metadata.gameSpeed;
			this.applyMovementChanges(scene);
			this.effectInterval += scene.metadata.gameSpeed;
			this.activateEffect();
			if (this.unstuckTimer >= UNSTUCK_TIMER) {
				this.launchBall(this.mesh.position.x >= 0 ? -1 : 1);
				this.unstuckTimer = 0;
			}
		});
		return sceneObserver;
	}

	protected applyMovementChanges(scene: babylon.Scene): void {
		if (this.justCollided) {
			this.realDirection = this.physic.body.getLinearVelocity(); // remember original velocity, to apply movement changes on it
			this.justCollided = false;
			this.forceDirection = -1; // reset forceDirection
			this.force = BALL_ANGULAR_FORCE; // reset angularForce
		}
		if (this.force <= 0)
			this.forceDirection *= -1;
		this.applySpin();
		this.adjustSpeed(scene);
	}

	/** applies two contradictory forces on either side of the ball */
	private applySpin(): void {
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

	protected async sendParticuleEvent(sockets: WebSocket[], type: ParticlesType, position: Position, size: number) : Promise<void> {
		const time: EventMessage = {
			status: Status.EVENT,
			type : type,
			color: this.particleColor,
			position: position,
			size: size
		};
		sockets.forEach((socket) => {
			socket.send(JSON.stringify(time));
		});
	}

	private checkBallCollision(sockets: WebSocket[]): babylon.Observer<babylon.IPhysicsCollisionEvent> {
		const collisionObserver = this.collisionObservable.add((collisionEvent) => {
			const metadata = collisionEvent.collidedAgainst.transformNode.metadata;
			if (!metadata)
				return;
			if (metadata.type === "goal")
				this.isInGoal = metadata.player === 1 ? "player1" : "player2";
			if (metadata.type === "collider") {
				this.justCollided = true;
				if (collisionEvent.point && this.particleCooldown <= 0 && !this.gameStopped) {
					this.sendParticuleEvent(sockets, "collision", vec3ToPos(collisionEvent.point), 1);
					this.particleCooldown++;
				}
				this.checkSpin(collisionEvent);
				this.checkStun(collisionEvent);
			}
		});
		return collisionObserver;
	}

	private checkStun(collisionEvent: babylon.IPhysicsCollisionEvent): void {
		const ballStunType = this.mesh.metadata?.stun;
		if (!ballStunType)
			return;

		const player = collisionEvent.collidedAgainst.transformNode;

		const side = this.checkSideHit(collisionEvent);
		if ((ballStunType === "spin" && side === "normal")
			|| (ballStunType === "normal" && side === "spinEffect")) {
			player.metadata.stunDuration = PLAYER_STUN_DURATION;
			if (this.type === "canon")
				this.destroy();
		}
	}

	/** check if the player has the spinEffect and change the spinning boolean of the ball if so */
	private checkSpin(collisionEvent: babylon.IPhysicsCollisionEvent) : void {
		const metadata = collisionEvent.collidedAgainst.transformNode.metadata;
		if (!metadata)
			return;
		this.spinningLeft = false;
		this.spinningRight = false;
		if (this.checkSideHit(collisionEvent) === "spinEffect") {
			if (collisionEvent.point === null)
				return;
			const mesh = collisionEvent.collidedAgainst.transformNode;
			const localPoint = babylon.Vector3.TransformCoordinates(
				collisionEvent.point,
				babylon.Matrix.Invert(mesh.getWorldMatrix())
			);

			if (localPoint.z <= 0) {
				metadata.playerId === 1 ? this.spinningRight = true : this.spinningLeft = true;
			} else {
				metadata.playerId === 1 ? this.spinningLeft = true : this.spinningRight = true;
			}
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
			this.unstuckTimer = 0;
			const face = nearestMesh.metadata.face;
			return face;
		}
		return "";
	}

	/** damp ball if too fast */
	protected adjustSpeed(scene: babylon.Scene): void {
		const velocity = this.physic.body.getLinearVelocity();
		const speed = velocity.length();

		let dampingFactor = 0;
		if (speed > this.maxSpeed) {
			const excessRatio = (speed - this.maxSpeed) / speed; // On ] 0; 1 ]
			dampingFactor = excessRatio * NERF_SPEED_FACTOR;
		}
		this.physic.body.setLinearDamping(dampingFactor);

		if (speed < this.minSpeed) {
			this.buffSpeedTimer += scene.metadata.gameSpeed;
			if (this.buffSpeedTimer >= BUFF_SPEED_INTERVAL) {
				this.buffSpeedTimer -= BUFF_SPEED_INTERVAL;
				this.physic.body.applyImpulse(velocity.normalize().scale(30), this.mesh.position);
				this.sendParticuleEvent(this.sockets, "impulse", vec3ToPos(this.mesh.position), 1);
			}
		}
	}

	start(): void {
		this.gameStopped = false;
	}

	reset(): void {
		this.physic.body.disablePreStep = true;
		this.mesh.position = new babylon.Vector3(0, 0, 0);
		this.physic.body.disablePreStep = false;
		this.physic.body.setLinearVelocity(new babylon.Vector3(0, 0, 0));
		this.spinningRight = false;
		this.spinningLeft = false;
		this.unstuckTimer = 0;
		this.particleCooldown = 0;
		this.buffSpeedTimer = 0;
		this.forceDirection = -1;
		this.effectInterval = 0;
		this.maxSpeed = this.originalMaxSpeed;
		this.minSpeed = this.originalMinSpeed;
		this.increaseMaxMinSpeedTimer = 0;
	}

	/**launch ball */
	launchBall(directionX?: 1 | -1, customStartingDirection?: babylon.Vector3): void {
		const startingDirection = directionX ? directionX : (Math.random() < 0.5 ? 1 : -1);
		customStartingDirection ?
			this.physic.body.setLinearVelocity(customStartingDirection.normalize().scale(30)) :
			this.physic.body.setLinearVelocity(new babylon.Vector3(startingDirection * 30, 0, 0));
		this.sendParticuleEvent(this.sockets, "impulse", vec3ToPos(this.mesh.position), 1);
		this.justCollided = true;
	}

	/** hides ball on goal and stop intervals */
	stop(): void {
		this.gameStopped = true;
	}

	setJustCollide(): void {
		this.justCollided = true;
	}

	getGoal(): "player1" | "player2" | null {
		return this.isInGoal;
	}

	getPosition(): Position {
		return { x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z };
	}

	getDirection(): Position {
		const linearVelocity = this.physic.body.getLinearVelocity();
		return { x: linearVelocity.x, y: linearVelocity.y, z: linearVelocity.z };
	}

	getVisibility(): number {
		return this.mesh.visibility;
	}

	getType(): BallOption {
		return this.type;
	}

	destroy(): void {
		this.mesh.visibility = 0;
		const size = this.type === "canon" ? 0.4 : 1;
		this.sendParticuleEvent(this.sockets, "explosion", vec3ToPos(this.mesh.position), size);
		this.collisionObservable.remove(this.collisionObserver);
		this.sceneObservable.remove(this.sceneObserver);
		this.yObservable.remove(this.yObserver);
		this.physic?.dispose();
		this.mesh?.material?.dispose();
		this.mesh?.dispose();
	}

	abstract activateEffect(): void;
}

export { BallTemplate };
