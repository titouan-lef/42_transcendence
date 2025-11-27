import { PlanePosition } from "../types_transfert";

type MapOption = "default" | "volcano" | "sky" | "desert";
const MAPLIST: MapOption[] = ["default", "volcano", "sky", "desert"];
type MapChoice = "random" | MapOption[];
type BallOption = "default" | "random" | "invisible" | "tricky" | "pulse" | "snake";
type PlayerKeys = [KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"]];

interface PlayerSettings {
	readonly playerId: 1 | 2;
	readonly socket: WebSocket | undefined;
	readonly playerKeys: PlayerKeys | undefined;
}

function swapPlayer(id: 1 | 2): 1 | 2 {
	return id === 1 ? 2 : 1;
}

class GameSettings {
	map: MapOption;
	wind: PlanePosition;
	ball: BallOption;
	rotatingPlayer: boolean;
	spin: boolean;

	readonly player1: PlayerSettings;
	readonly player2: PlayerSettings;

	constructor(playerId: 1 | 2, map: MapOption, wind: PlanePosition, ball: BallOption, rotatingPlayer: boolean, spin: boolean,
		player1: WebSocket, player1Keys: PlayerKeys, player2?: WebSocket, player2Keys?: PlayerKeys) {
		this.map = map;
		this.wind = wind;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.spin = spin;
		this.player1 = {
			playerId: playerId,
			socket: player1,
			playerKeys: player1Keys
		};
		this.player2 = {
			playerId: swapPlayer(playerId),
			socket: player2,
			playerKeys: player2Keys
		};
	}
}

export { BallOption, PlayerKeys, PlayerSettings, GameSettings, MapChoice, MapOption };
