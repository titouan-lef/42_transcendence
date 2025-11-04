import * as babylon from "@babylonjs/core";
import { GameSettings, PlayerKeys } from "./GameSettings.js";
import { PLAYER_DIMENSION, COLORS, MAP_SIZE, WALL_WIDTH, PLAYER_MASS, PLAYER_RESTITUTION, PLAYER_MOVEMENT_VELOCITY, PLAYER_ROTATION_VELOCITY } from "./values.js";

export class Player {
	/**@todo set to private */
	readonly mesh: babylon.Mesh;
	private readonly color: babylon.Color3 = COLORS.white;
	private readonly controls: PlayerKeys;
	private readonly keyPressed: boolean[] = [false, false, false, false, false];
	private readonly rotatingPlayer: boolean;
	private readonly applyingSpin;
	private readonly highlight: babylon.HighlightLayer;

	private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	private readonly positionObserver: babylon.Observer<babylon.Scene>;
	private readonly body: babylon.PhysicsBody;
	private linearVelocityZ = 0;
	private angularVelocityY = 0;

	constructor(scene: babylon.Scene, position: babylon.Vector2, settings: GameSettings, controls: PlayerKeys) {
		this.mesh = this.setPlayer(scene, position);
		this.highlight = new babylon.HighlightLayer("highlight", scene);
		this.body = new babylon.PhysicsBody(this.mesh, babylon.PhysicsMotionType.ANIMATED, false, scene);
		this.body.setMassProperties({
			mass: PLAYER_MASS,
			centerOfMass: babylon.Vector3.Zero()
		});
		this.body.shape = new babylon.PhysicsShapeBox(babylon.Vector3.Zero(), babylon.Quaternion.Identity(),
			PLAYER_DIMENSION, scene);
		this.body.shape.material = { restitution: PLAYER_RESTITUTION, friction: 0 };
		this.setMaterial(scene, this.color);
		this.rotatingPlayer = settings.rotatingPlayer;
		this.applyingSpin = settings.spin;
		
		this.controls = controls;
		
		this.sceneObservable = scene.onBeforeRenderObservable;
		this.positionObserver = this.playerObserver();

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

	private handleKeyDown = (event: KeyboardEvent): void => {
		/**@todo a enlever avec serverside */
		event.preventDefault(); // prevent the action from the navigator (ex: space)
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && !this.keyPressed[i]) {
				this.handleAction(event.code);
				this.keyPressed[i] = true;
			}
		}
	};

	private handleKeyUp = (event: KeyboardEvent): void => {
		/**@todo a enlever avec serverside */
		event.preventDefault(); // prevent the action from the navigator (ex: space)
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && this.keyPressed[i]) {
				if (event.code === this.controls[0] || event.code === this.controls[1])
					this.linearVelocityZ = 0;
				if (event.code === this.controls[2] || event.code === this.controls[3])
					this.angularVelocityY = 0;
				this.keyPressed[i] = false;
			}
		}
	};

	/**@todo c'est sale mais ca va changer avec le serverside. Envoie de la key au server */
	private handleAction(event: KeyboardEvent["code"]): void {
		switch (event) {
			case this.controls[0]:
				this.linearVelocityZ = -PLAYER_MOVEMENT_VELOCITY;
				break;
			case this.controls[1]:
				this.linearVelocityZ = PLAYER_MOVEMENT_VELOCITY;
				break;
			case this.controls[2]:
				if (this.rotatingPlayer) {
					this.angularVelocityY = -PLAYER_ROTATION_VELOCITY;
				}
				break;
			case this.controls[3]:
				if (this.rotatingPlayer) {
					this.angularVelocityY = PLAYER_ROTATION_VELOCITY;
				}
				break;
			case this.controls[4]:
				if (this.applyingSpin)
					if (this.mesh.metadata.playerSpinning === true) {
						this.mesh.metadata.playerSpinning = false;
						this.highlight.removeMesh(this.mesh);
					} else {
						this.mesh.metadata.playerSpinning = true;
						this.highlight.addMesh(this.mesh, COLORS.red);
					}
					/**@todo make a visual effect to show if effect is activated or not */
				break;
			default: ;
		}
	}

	private playerObserver(): babylon.Observer<babylon.Scene> {
		const distanceFromEdge = (MAP_SIZE.z / 2) - (WALL_WIDTH * 2) - (PLAYER_DIMENSION.z / 2);
		const positionObserver = this.sceneObservable.add(() => {
			if (this.mesh.position.z < -distanceFromEdge && this.linearVelocityZ === -PLAYER_MOVEMENT_VELOCITY)
				this.linearVelocityZ += PLAYER_MOVEMENT_VELOCITY;
			if (this.mesh.position.z > distanceFromEdge && this.linearVelocityZ === PLAYER_MOVEMENT_VELOCITY)
				this.linearVelocityZ -= PLAYER_MOVEMENT_VELOCITY;
			this.body.setLinearVelocity(new babylon.Vector3(0, 0, this.linearVelocityZ)); 
			this.body.setAngularVelocity(new babylon.Vector3(0, this.angularVelocityY, 0));
		});
		return positionObserver;
	} 

	destroy(): void {
		/**@todo in case we want to Lock player on Z axe */
		this.sceneObservable.remove(this.positionObserver);
		this.body.shape?.dispose();
		this.body.dispose();
		this.mesh.material?.dispose();
		this.highlight.dispose();
		this.mesh.dispose();
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
	}
}
