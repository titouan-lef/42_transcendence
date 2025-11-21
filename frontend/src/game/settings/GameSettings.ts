import { PlanePosition } from "../types_transfert";

type MapOption = "default" | "random" | "volcano" | "sky" | "desert";
type BallOption = "default" | "random" | "invisible" | "tricky" | "pulse" | "snake";
type PlayerKeys = [KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"]];

interface PlayerSettings {
	readonly playerId: 1 | 2;
	readonly playerKeys: PlayerKeys;
}

class GameSettings {
	map: MapOption;
	wind: PlanePosition;
	ball: BallOption;
	rotatingPlayer: boolean;
	spin: boolean;

	readonly myId: 1 | 2;
	readonly player1: PlayerSettings;
	readonly player2: PlayerSettings;

	constructor(myId: 1 | 2, map:  MapOption, wind: PlanePosition, ball: BallOption, rotatingPlayer: boolean, spin: boolean,
		player1Keys: PlayerKeys, player2Keys: PlayerKeys) {
		this.map = map;
		this.wind = wind;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.spin = spin;
		this.myId = myId;
		this.player1 = {
			playerId: 1,
			playerKeys: player1Keys
		};
		this.player2 = {
			playerId: 2,
			playerKeys: player2Keys
		};
	}
}

export { MapOption, BallOption, PlayerKeys, PlayerSettings, GameSettings };
