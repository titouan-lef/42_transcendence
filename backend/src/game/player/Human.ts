import * as babylon from "@babylonjs/core";
import { GameOptions, PlayerSettings } from "../settings/GameSettings.js";
import { PlayerControls, DataMessage } from "../../../shared/types_transfert.js";
import { Player } from "./Player.js";
import { WebSocket } from "ws";

class Human extends Player {
	private readonly socket: WebSocket;

	constructor(scene: babylon.Scene, position: babylon.Vector2, options: GameOptions, settings: PlayerSettings) {
		super(scene, position, options, settings.playerId, settings.username);

		this.socket = settings.socket;

		this.socket.on("message", (message: Buffer) => {
			let controls: PlayerControls;
			try {
				controls = JSON.parse(message.toString());
			} catch {
				return;
			}
			this.setControls(controls);
		});
	}

	async send(message: DataMessage): Promise<void> {
		this.socket?.send(JSON.stringify(message));
	}

	async closeSocket(): Promise<void> {
		this.socket?.close();
	}

	async defineCloseAction(fn: () => void): Promise<void> {
		this.socket.on("close", fn);
	}

	destroy(): void {
		super.destroy();
		this.socket?.close();
	}
}

export { Human };
