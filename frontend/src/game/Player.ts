import * as babylon from "@babylonjs/core";
import { GameSettings, PlayerSettings } from "./GameSettings.js";
import { PlayerKeys } from "./GameSettings.js";
import { PLAYER_DIMENSION, COLORS } from "./values.js";
import { PlayerControls } from "./data_transfert.js";

export class Player {
	readonly mesh: babylon.Mesh;
	readonly username: string;
	private readonly color: babylon.Color3 = COLORS.white;
	private readonly controls: PlayerKeys;
	private readonly keyPressed: boolean[] = [false, false, false, false, false];

	private readonly applyingSpin;

	/**@todo in case we want to Lock player on Z axe */
	// private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	// private readonly positionObserver: babylon.Observer<babylon.Scene>;
	// private readonly originalPosXY: babylon.Vector2;

	constructor(scene: babylon.Scene, position: babylon.Vector2, settings: GameSettings, playerSettings: PlayerSettings) {
		this.mesh = this.setPlayer(scene, position);
		this.setMaterial(scene, this.color);
		this.applyingSpin = settings.spin;

		this.username = playerSettings.username;
		this.controls = playerSettings.playerKeys;

		/**@todo in case we want to Lock player on Z axe */
		// this.sceneObservable = scene.onBeforeRenderObservable;
		// this.positionObserver = this.observeXY();
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

	handleKeyDown = (event: KeyboardEvent): PlayerControls => {
		/**@todo a enlever avec serverside */
		event.preventDefault(); // prevent the action from the navigator (ex: space)
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && !this.keyPressed[i]) {
				this.keyPressed[i] = true;
			}
		}
		const controls: PlayerControls = {
			mov_right: this.keyPressed[0],
			mov_left: this.keyPressed[1],
			rot_right: this.keyPressed[2],
			rot_left: this.keyPressed[3],
			apply_effect: this.keyPressed[4],
		};
		return controls;
	};

	handleKeyUp = (event: KeyboardEvent): void => {
		/**@todo a enlever avec serverside */
		event.preventDefault(); // prevent the action from the navigator (ex: space)
		for (let i = 0; i < this.controls.length; i++) {
			if (event.code === this.controls[i] && this.keyPressed[i]) {
				//console.log(this.controls[i] + "up");
				this.keyPressed[i] = false;
			}
		}
	};

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
		this.mesh.material?.dispose();
		this.mesh.dispose();
	}
}
