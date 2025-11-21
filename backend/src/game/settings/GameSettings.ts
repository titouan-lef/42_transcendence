import { WebSocket } from "ws";

type MapOption = "default" | "random" | "volcano" | "sky" | "desert";
type BallOption = "default" | "random" | "invisible" | "tricky" | "pulse" | "snake";

interface PlayerSettings {
	readonly playerId: 1 | 2 ;
	readonly socket: WebSocket;
	readonly username: string;
}

class GameSettings {
	readonly map: MapOption;
	readonly ball: BallOption;
	readonly rotatingPlayer: boolean;
	readonly spin: boolean;

	readonly player1: PlayerSettings;
	readonly player2: PlayerSettings;

	readonly windAffectsBall: boolean;

	constructor(map: MapOption, ball: BallOption, rotatingPlayer: boolean, spin: boolean,
		player1: WebSocket, player2: WebSocket, playerName1: string, playerName2: string, windAffectsBall: boolean) {
		this.map = map;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.spin = spin;
		this.player1 = {
			playerId: 1,
			socket: player1,
			username: playerName1
		};
		this.player2 = {
			playerId: 2,
			socket: player2,
			username: playerName2
		};
		this.windAffectsBall = windAffectsBall;
	}
}

export { MapOption, BallOption, PlayerSettings, GameSettings };
