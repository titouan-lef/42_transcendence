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
	readonly windAffectsBall: boolean;

	readonly player1: PlayerSettings;
	readonly player2?: PlayerSettings;

	constructor(map: MapOption, ball: BallOption, rotatingPlayer: boolean, spin: boolean, windAffectsBall: boolean,
		player1: WebSocket, playerName1: string, player2?: WebSocket, playerName2?: string) {
		this.map = map;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.spin = spin;
		this.windAffectsBall = windAffectsBall;
		this.player1 = {
			playerId: 1,
			socket: player1,
			username: playerName1
		};
		if (player2 && playerName2) {
			this.player2 = {
				playerId: 2,
				socket: player2,
				username: playerName2
			};
		}
	}
}

export { MapOption, BallOption, PlayerSettings, GameSettings };
