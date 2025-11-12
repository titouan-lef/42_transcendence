import { WebSocket } from "ws";

export type MapOption = "default" | "random" | "volcano" | "windy" | "frozen" | "rainy";
export type BallOption = "default" | "random" | "invisible" | "tricky" | "heavy" | "snake";

export interface PlayerSettings {
	readonly socket: WebSocket;
	readonly username: string;
}

export class GameSettings {
	readonly map: MapOption;
	readonly ball: BallOption;
	readonly rotatingPlayer: boolean;
	readonly spin: boolean;
	readonly player1: PlayerSettings;
	readonly player2: PlayerSettings;

	constructor(map: MapOption, ball: BallOption, rotatingPlayer: boolean, effects: boolean, 
		player1: WebSocket, player2: WebSocket, playerName1: string, playerName2: string) {
		this.map = map;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.spin = effects;
		this.player1 = {
			socket: player1,
			username: playerName1
		};
		this.player2 = {
			socket: player2,
			username: playerName2
		};
	}
}