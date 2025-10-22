import * as babylon from "/babylonjs/core/index.js";
import { BallTemplate } from "./ballTemplate.js";
import { COLORS, SNAKE_BALL_EFFECT_INTERVAL, SNAKE_BALL_S_FORCE, SNAKE_BALL_S_INTERVAL } from "../values.js";

export class SnakeBall extends BallTemplate {
	protected trailIntervalId: ReturnType<typeof setInterval>;
	private readonly color: babylon.Color3 = COLORS.green;
	//private readonly effectIntervalId: ReturnType<typeof setInterval>;

	//
	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly sceneObserver: babylon.Observer<babylon.Scene>;
	private force = SNAKE_BALL_S_FORCE;
	private	forceDirection = -1;

	private justCollided = false;
	private realDirection: babylon.Vector3;
	//

	constructor(scene: babylon.Scene) {
		super(scene, "snake");
		this.setMaterial(scene, this.color);
		this.trailIntervalId = this.setTrail(scene, this.color);
		// this.effectIntervalId = this.activateEffet();
		
		this.physic.body.setLinearVelocity(new babylon.Vector3((Math.random()  * 2 - 1) * 30, 0, (Math.random()  * 2 - 1) * 30));
		this.realDirection = this.physic.body.getLinearVelocity();
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.sceneObserver = this.move();
	}
	
	setMaterial(scene: babylon.Scene, color: babylon.Color3): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = color;
		this.mesh.material = material;
	}

	destroyRest(): void {
		//clearInterval(this.effectIntervalId);
		clearInterval(this.trailIntervalId);

		this.sceneObservable.remove(this.sceneObserver);
	}

	/**@todo gain a impulse on a side then on an other, ect */
	activateEffet(): ReturnType<typeof setInterval> {
		const effectIntervalId = setInterval(() => {
			//
			const currentDirection = this.physic.body.getLinearVelocity().normalize();
			//
			this.physic.body.applyForce(
				new babylon.Vector3(currentDirection.z, 0, currentDirection.x),
				this.mesh.position
			);
		}, SNAKE_BALL_EFFECT_INTERVAL);
		return effectIntervalId;
	}

	move(): babylon.Observer<babylon.Scene> {
		const sceneObserver = this.sceneObservable.add(() => {
			if (this.justCollided) {
				this.realDirection = this.physic.body.getLinearVelocity();
				this.justCollided = false;
			}

			if (this.force >= SNAKE_BALL_S_FORCE || this.force <= 0) {
				this.forceDirection *= -1;
			}
			this.force -= (SNAKE_BALL_S_FORCE / SNAKE_BALL_S_INTERVAL) * this.forceDirection;

			this.physic.body.applyForce(
				new babylon.Vector3(this.realDirection.z * this.force, 0, -this.realDirection.x * this.force),
				this.mesh.position
			);
			this.physic.body.applyForce(
				new babylon.Vector3(-this.realDirection.z * (SNAKE_BALL_S_FORCE - this.force), 0, this.realDirection.x * (SNAKE_BALL_S_FORCE - this.force)),
				this.mesh.position
			);
		});
		return sceneObserver;
	}
	// every *interval* ms, the force applied will be recalculated
	// pour faire un effet de courbe il faudrait qu'il y ai deux forces qui soient appliquées de part et d autres 
	// du mesh et qui varient, par exemple le total des forces sera toujours egale a 10, et la forc vers la droite commence 10 et l autre a 0
	// puis elle diminue progressivement pendant que l aurte augmente
}