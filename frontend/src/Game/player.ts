import { GameSettings } from "./gameSettings";
import { PlayerKeys } from "./gameSettings";

export class Player {
	readonly mesh: BABYLON.Mesh;
	private readonly controls: PlayerKeys;
	private readonly rotatingPlayer: boolean;
	private keyPressed: boolean[] = [false, false, false, false];
	//private readonly jump: boolean;

	constructor(scene: BABYLON.Scene, settings: GameSettings, controls: PlayerKeys) {
		this.mesh = BABYLON.MeshBuilder.CreateBox("player", {width: 3, height: 3, depth: 10}, scene);
		this.controls = controls;
		this.rotatingPlayer = settings.rotatingPlayer;
		//this.jump = settings.jump;
		window.addEventListener("keydown", (event) => this.handleKeyDown(event.code));
		window.addEventListener("keyup", (event) => this.handleKeyUp(event.code));
	}

	private handleKeyDown(event: KeyboardEvent["code"]): void {
		for (let i = 0; i < this.controls.length; i++){
			if (event === this.controls[i] && !this.keyPressed[i]){
				this.handleAction(event);
				this.keyPressed[i] = true;
			}
		}
	}

	private handleKeyUp(event: KeyboardEvent["code"]): void {
		for (let i = 0; i < this.controls.length; i++){
			if (event === this.controls[i] && this.keyPressed[i]){
				console.log(this.controls[i] + "up");
				this.keyPressed[i] = false;
			}
		}
	}

	private handleAction(event: KeyboardEvent["code"]): void{
		switch(event){
			case this.controls[0]:
				console.log(this.controls[0] + "down");
				break;
			case this.controls[1]:
				console.log(this.controls[1] + "down");
				break;
			case this.controls[2]:
				console.log(this.controls[2] + "down");
				break;
			case this.controls[3]:
				console.log(this.controls[3] + "down");
				break;
			default: ;
		}
	}

	destroy(): void{
		this.mesh.dispose();
	}
}