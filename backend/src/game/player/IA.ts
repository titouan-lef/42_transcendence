import * as babylon from "@babylonjs/core";
import { GameSettings } from "../settings/GameSettings.js";
import { DataMessage } from "../../web_sockets/types_transfert.js";
import { Player } from "./Player.js";

class AI extends Player {

	constructor(scene: babylon.Scene, position: babylon.Vector2, gameSettings: GameSettings) {
		super(scene, position, gameSettings, 2);
	}

	/** @todo Get game info and change his position */

	async send(message: DataMessage): Promise<void> {}

	getName(): string {
		return "AI";
	}

	destroy(): void {
		super.destroy();
	}
}

export { AI };