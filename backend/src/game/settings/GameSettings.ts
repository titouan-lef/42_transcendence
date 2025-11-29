import { WebSocket } from "ws";

const MAP_LIST: MapOption[] = ["default", "volcano", "sky", "desert"];
type MapOption = "default" | "volcano" | "sky" | "desert";
type MapChoice = "random" | MapOption[];
const BALL_LIST: BallOption[] = ["default", "invisible", "tricky", "pulse", "snake"];
type BallOption = "default" | "invisible" | "tricky" | "pulse" | "snake";
type BallChoice = "random" | BallOption[];

interface PlayerSettings {
	readonly playerId: 1 | 2 ;
	readonly socket: WebSocket;
	readonly username: string;
}

interface GameOptions { /** @toto include GameOptions in GameSettings ? */
	map: MapChoice;
	ball: BallChoice;
	rotatingPlayer: boolean;
	spin: boolean;
	windAffectsBall: boolean;
	dashingPlayer: boolean;
}

class GameSettings {
	readonly options: GameOptions;

	readonly player1: PlayerSettings;
	readonly player2?: PlayerSettings;

	constructor(options: GameOptions, player1: WebSocket, playerName1: string, player2?: WebSocket, playerName2?: string) {
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

export { MapChoice, MapOption, BallOption, PlayerSettings, GameSettings, MAP_LIST, GameOptions, BALL_LIST };
