import * as babylon from "@babylonjs/core";
import { GameSettings, PlayerSettings } from "../settings/GameSettings.js";
import { PlayerControls, DataMessage } from "../web_sockets/types_transfert.js";
import { WebSocket } from "ws";
import { Player } from "./Player.js";

class Human extends Player {
	private readonly username: string;
	private readonly socket: WebSocket;

	constructor(scene: babylon.Scene, position: babylon.Vector2, gameSettings: GameSettings, settings: PlayerSettings) {
		super(scene, position, gameSettings, settings.playerId);

		this.username = settings.username;
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

	getName(): string {
		return this.username;
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
