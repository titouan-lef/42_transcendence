import * as babylon from "/babylonjs/core/index.js";
import { GameSettings } from "./gameSettings.js";
import { PlayerKeys } from "./gameSettings.js";
import { PLAYER_DIMENSION, COLORS } from "./values.js";

export class Player {
	readonly mesh: babylon.Mesh;
	private readonly controls: PlayerKeys;
	private readonly rotatingPlayer: boolean;
	private keyPressed: boolean[] = [false, false, false, false];
	/**@todo private readonly jump: boolean; ??*/

	constructor(scene: babylon.Scene, settings: GameSettings, controls: PlayerKeys) {
		this.mesh = babylon.MeshBuilder.CreateBox("player", { width: PLAYER_DIMENSION.x, height: PLAYER_DIMENSION.y, depth: PLAYER_DIMENSION.z }, scene);
		this.mesh.position.y = PLAYER_DIMENSION.y/2;
		this.mesh.renderingGroupId = 1;

		/**@todo do a function for this ? */
		const material = new babylon.StandardMaterial('ballcolor', scene);
		material.emissiveColor =  COLORS.white;
		this.mesh.material = material;
		//

		this.controls = controls;
		this.rotatingPlayer = settings.rotatingPlayer;

		/**@todo this.jump = settings.jump; ??*/

		window.addEventListener("keydown", (event) => this.handleKeyDown(event.code));
		window.addEventListener("keyup", (event) => this.handleKeyUp(event.code));
	}

	private handleKeyDown(event: KeyboardEvent["code"]): void {
		for (let i = 0; i < this.controls.length; i++) {
			if (event === this.controls[i] && !this.keyPressed[i]) {
				this.handleAction(event);
				this.keyPressed[i] = true;
			}
		}
	}

	private handleKeyUp(event: KeyboardEvent["code"]): void {
		for (let i = 0; i < this.controls.length; i++) {
			if (event === this.controls[i] && this.keyPressed[i]) {
				console.log(this.controls[i] + "up");
				this.keyPressed[i] = false;
			}
		}
	}

	/**@todo envoie de la key au server */
	private handleAction(event: KeyboardEvent["code"]): void {
		
	}

	destroy(): void {
		this.mesh.dispose();
	}
}