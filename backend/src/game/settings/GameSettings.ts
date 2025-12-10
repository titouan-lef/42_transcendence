import { WebSocket } from "ws";

type MapOption = "default" | "volcano" | "sky" | "desert";
type BallOption = "default" | "invisible" | "tricky" | "pulse" | "snake" | "canon";

interface PlayerSettings {
	readonly playerId: 1 | 2 ;
	readonly socket: WebSocket;
	readonly username: string;
}

interface GameOptions {
	map: MapOption[];
	ball: BallOption[];
	rotatingPlayer: boolean;
	spin: boolean;
	windAffectsBall: boolean;
	dashingPlayer: boolean;
	canonCount: number;
}

class GameSettings {
	readonly options: GameOptions;
	readonly isRanked: boolean;

	readonly player1: PlayerSettings;
	readonly player2?: PlayerSettings;

	constructor(isRanked: boolean, options: GameOptions, player1: WebSocket, playerName1: string, player2?: WebSocket, playerName2?: string) {
		this.isRanked = isRanked;
		this.options = options;
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

export { MapOption, BallOption, PlayerSettings, GameSettings, GameOptions };

