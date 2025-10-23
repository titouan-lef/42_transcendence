import * as babylon from "/babylonjs/core/index.js";
import { GameSettings } from "./gameSettings.js";
import { PlayerKeys } from "./gameSettings.js";
import { PLAYER_DIMENSION, COLORS, MAP_SIZE, WALL_WIDTH, PLAYER_MOVEMENT_IMPULSE, PLAYER_ROTATION_IMPULSE, PLAYER_MASS } from "./values.js";

export class Player {
	readonly mesh: babylon.Mesh;
	private readonly color: babylon.Color3 = COLORS.white;
	private readonly physic: babylon.PhysicsAggregate;
	private readonly controls: PlayerKeys;
	private readonly rotatingPlayer: boolean;
	private readonly keyPressed: boolean[] = [false, false, false, false, false];
	
	private readonly axeZ: babylon.Mesh;
	private readonly axeZPhysic: babylon.PhysicsAggregate;
	private readonly rotater: babylon.Mesh | null;
	private readonly rotaterPhysic: babylon.PhysicsAggregate | null;
	private readonly zConstraint: babylon.PrismaticConstraint;
	private readonly distanceConstraint: babylon.Physics6DoFConstraint;
	private readonly movementConstraint: babylon.Physics6DoFConstraint | null;

	private readonly applyingSpin;

	/**@todo in case we want to Lock player on Z axe */
	// private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	// private readonly positionObserver: babylon.Observer<babylon.Scene>;
	// private readonly originalPosXY: babylon.Vector2;

	constructor(scene: babylon.Scene, position: babylon.Vector2, settings: GameSettings, controls: PlayerKeys) {
		this.mesh = this.setPlayer(scene, position);
		this.physic = new babylon.PhysicsAggregate(this.mesh, babylon.PhysicsShapeType.BOX, { mass: PLAYER_MASS }, scene);
		/**@todo in case we want to Lock player on Z axe */
		//this.originalPosXY = new babylon.Vector2(position.x, this.mesh.position.y);
		this.physic.body.setLinearDamping(2); // freinage
		this.physic.body.setAngularDamping(5);
		this.setMaterial(scene, this.color);
		this.rotatingPlayer = settings.rotatingPlayer;
		this.applyingSpin = settings.spin;

		this.axeZ = this.setAxeZ(scene, position);
		this.axeZPhysic = new babylon.PhysicsAggregate(this.axeZ, babylon.PhysicsShapeType.BOX, { mass: 0 }, scene);
		this.axeZPhysic = new babylon.PhysicsAggregate(this.axeZ, babylon.PhysicsShapeType.BOX, { mass: 0 }, scene);

		if (this.rotatingPlayer) {
			this.rotater = this.setRotater(scene, position);
			this.rotaterPhysic = new babylon.PhysicsAggregate(this.rotater, babylon.PhysicsShapeType.BOX, { mass: PLAYER_MASS }, scene);
		} else{
			this.rotater = null;
			this.rotaterPhysic = null;
		}
		
		this.zConstraint = this.setZConstraint(scene);
		this.distanceConstraint = this.setDistanceConstraint(scene);
		this.movementConstraint = this.setMovementConstraint(scene);

		this.controls = controls;

		/**@todo in case we want to Lock player on Z axe */
		// this.sceneObservable = scene.onBeforeRenderObservable;
		// this.positionObserver = this.observeXY();

		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);
	}

	private setPlayer(scene: babylon.Scene, position: babylon.Vector2): babylon.Mesh {
		const player = babylon.MeshBuilder.CreateBox("player", 
			{ width: PLAYER_DIMENSION.x, height: PLAYER_DIMENSION.y, depth: PLAYER_DIMENSION.z }, scene);
		player.position.x = position.x;
		player.position.y = position.y;
		player.renderingGroupId = 1;
		player.metadata = { type: "collider", playerSpinning: false };
		return player;
	}

	private setMaterial(scene: babylon.Scene, color: babylon.Color3): void {
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor = color;
		this.mesh.material = material;
	}

	/**Le truc qui retient le rotater de toucher le mur ou de trop sortir de l axe Z avec Zconstraint et distanceConstraint */
	private setAxeZ(scene: babylon.Scene, position: babylon.Vector2): babylon.Mesh {
		const distanceFromGround = position.y + 10; //10 seems to be a good value
		const axeZ = babylon.MeshBuilder.CreateBox("contraint", { width: 1, height: 1, depth: 1 }, scene);
		axeZ.position.x = position.x;
		axeZ.position.y = distanceFromGround;
		axeZ.renderingGroupId = 1;
		axeZ.isVisible = true;
		return axeZ;
	}

	/**Le truc qui retient le joueur de bouger avec movementConstraint */
	private setRotater(scene: babylon.Scene, position: babylon.Vector2): babylon.Mesh {
		const rotater = babylon.MeshBuilder.CreateBox("rotater", { width: 1, height: 1, depth: PLAYER_DIMENSION.x }, scene);
		rotater.position.x = position.x;
		rotater.position.y = position.y;
		rotater.renderingGroupId = 1;
		rotater.isVisible = true;
		return rotater;
	}

	/** 
	 * Empeche le Rotater de bouger sur un autre axe que Z
	 */
	private setZConstraint(scene: babylon.Scene): babylon.PrismaticConstraint {
		const zConstraint = new babylon.PrismaticConstraint(
			new babylon.Vector3(0, 0, 0),
			new babylon.Vector3(0, this.mesh.position.y - this.axeZ.position.y, 0),
			new babylon.Vector3(0, 0, 1),
			new babylon.Vector3(0, 0, 1),
			scene
		);
		if (this.rotaterPhysic) {
			this.rotaterPhysic.body.addConstraint(this.axeZPhysic.body, zConstraint);
		} else{
			this.physic.body.addConstraint(this.axeZPhysic.body, zConstraint);
		}
		return zConstraint;
	}

	/** 
	 * Empeche le Rotater d'atteindre les bords de map
	 */
	private setDistanceConstraint(scene: babylon.Scene): babylon.Physics6DoFConstraint {
		const distanceFromEdge = (MAP_SIZE.z / 2) - (WALL_WIDTH * 2) - (PLAYER_DIMENSION.z / 2);
		const distanceConstraint = new babylon.Physics6DoFConstraint({
			pivotA: new babylon.Vector3(0, 0, 0),
			pivotB: new babylon.Vector3(0, this.mesh.position.y - this.axeZ.position.y, 0),
			perpAxisA: new babylon.Vector3(0, 0, 0),
			perpAxisB: new babylon.Vector3(0, 0, 0),
		}, [
			{ axis: babylon.PhysicsConstraintAxis.LINEAR_DISTANCE, minLimit: 0, maxLimit: distanceFromEdge }
		], scene);
		if (this.rotaterPhysic) {
			this.rotaterPhysic.body.addConstraint(this.axeZPhysic.body, distanceConstraint);
		} else{
			this.physic.body.addConstraint(this.axeZPhysic.body, distanceConstraint);
		}
		return distanceConstraint;
	}

	/** 
	 * Attache le Player au Rotater, tout en autorisant la rotation en X
	 */
	private setMovementConstraint(scene: babylon.Scene): babylon.Physics6DoFConstraint | null {
		if (this.rotatingPlayer) {
			const movementConstraint = new babylon.Physics6DoFConstraint({
				pivotA: new babylon.Vector3(0, 0, 0),
				pivotB: new babylon.Vector3(0, 0, 0),
				perpAxisA: new babylon.Vector3(1, 0, 0),
				perpAxisB: new babylon.Vector3(1, 0, 0),
			}, [
				{ axis: babylon.PhysicsConstraintAxis.LINEAR_DISTANCE, minLimit: 0, maxLimit: 0 }
			], scene);
			if (this.rotaterPhysic) {
				this.rotaterPhysic.body.addConstraint(this.physic.body, movementConstraint);
			}
			return movementConstraint;
		} else{
			return null;
		}
	}

	private handleKeyDown = (event: KeyboardEvent): void => {
		/**@todo a enlever avec serverside */
		event.preventDefault(); // empêche l’action par défaut du navigateur
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && !this.keyPressed[i]) {
				this.handleAction(event.code);
				this.keyPressed[i] = true;
			}
		}
	};

	private handleKeyUp = (event: KeyboardEvent): void => {
		/**@todo a enlever avec serverside */
		event.preventDefault(); // empêche l’action par défaut du navigateur
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && this.keyPressed[i]) {
				//console.log(this.controls[i] + "up");
				this.keyPressed[i] = false;
			}
		}
	};

	/**@todo c'est sale mais ca va changer avec le serverside. Envoie de la key au server */
	private handleAction(event: KeyboardEvent["code"]): void {
		switch (event) {
			case this.controls[0]:
				this.impulse(-1);
				break;
			case this.controls[1]:
				this.impulse(1);
				break;
			case this.controls[2]:
				if (this.rotatingPlayer) {
					this.physic.body.applyImpulse(
						new babylon.Vector3(PLAYER_ROTATION_IMPULSE, 0, 0),
						new babylon.Vector3(this.mesh.absolutePosition.x, this.mesh.absolutePosition.y,
							this.mesh.absolutePosition.z - (PLAYER_DIMENSION.z / 2))
					);
				}
				break;
			case this.controls[3]:
				if (this.rotatingPlayer) {
					this.physic.body.applyImpulse(
						new babylon.Vector3(PLAYER_ROTATION_IMPULSE, 0, 0),
						new babylon.Vector3(this.mesh.absolutePosition.x, this.mesh.absolutePosition.y,
							this.mesh.absolutePosition.z + (PLAYER_DIMENSION.z / 2))
					);
				}
				break;
			case this.controls[4]:
				if (this.applyingSpin) {
					this.mesh.metadata.playerSpinning = this.mesh.metadata.playerSpinning ? false : true;
					/**@todo make a visual effect to show if effect is activated or not */
				}
				break;
			default: ;
		}
	}

	private impulse(directionZ: number): void {
		if (this.rotaterPhysic && this.rotater) {
			this.rotaterPhysic.body.applyImpulse(
				new babylon.Vector3(0, 0, PLAYER_MOVEMENT_IMPULSE * directionZ),
				this.rotater.absolutePosition
			);
		} else{
			this.physic.body.applyImpulse(
				new babylon.Vector3(0, 0, PLAYER_MOVEMENT_IMPULSE / 1.4 * directionZ),
				this.mesh.absolutePosition
			);
		}
	}

	/**@todo in case we want to Lock player on Z axe */
	// private observeXY(): babylon.Observer<babylon.Scene>{
	// 	const positionObserver = this.sceneObservable.add(() => {
	// 		this.mesh.position.x = this.originalPosXY.x;
	// 		this.mesh.position.y = this.originalPosXY.y;
	// if (this.rotater){
	// 	this.rotater.position.x = this.originalPosXY.x;
	// 	this.rotater.position.y = this.originalPosXY.y;
	// }
	// 	});
	// 	return positionObserver;
	// } 

	destroy(): void {
		this.zConstraint.dispose();
		this.distanceConstraint.dispose();
		if (this.movementConstraint) {
			this.movementConstraint.dispose();
		}
		this.axeZPhysic.dispose();
		this.axeZ.dispose();
		if (this.rotaterPhysic) {
			this.rotaterPhysic.dispose();
		}
		if (this.rotater) {
			this.rotater.dispose();
		}
		/**@todo in case we want to Lock player on Z axe */
		//this.sceneObservable.remove(this.positionObserver);
		//
		this.physic.dispose();
		this.mesh.material?.dispose();
		this.mesh.dispose();
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
	}
}