import { WebSocket } from "ws";

type MapOption = "default" | "volcano" | "sky" | "desert";
const MAPLIST: MapOption[] = ["default", "volcano", "sky", "desert"];
type MapChoice = "random" | MapOption[];
type BallOption = "default" | "random" | "invisible" | "tricky" | "pulse" | "snake";

interface PlayerSettings {
	readonly playerId: 1 | 2 ;
	readonly socket: WebSocket;
	readonly username: string;
}

interface GameOptions { /** @toto include GameOptions in GameSettings ? */
	map: MapChoice;
	ball: BallOption;
	rotatingPlayer: boolean;
	spin: boolean;
	windAffectsBall: boolean;
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

export { MapChoice, MapOption, BallOption, PlayerSettings, GameSettings, MAPLIST, GameOptions };
