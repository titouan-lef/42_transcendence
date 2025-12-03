import { PlanePosition } from "../types_transfert";

type MapOption = "default" | "volcano" | "sky" | "desert";
type BallOption = "default" | "invisible" | "tricky" | "pulse" | "snake";
type PlayerKey = KeyboardEvent["code"] | undefined;

interface PlayerKeys {
	mov_right: PlayerKey;
	mov_left: PlayerKey;
	rot_right: PlayerKey;
	rot_left: PlayerKey;
	normalMode: PlayerKey;
	spinMode: PlayerKey;
	emoteStrong: PlayerKey;
	emoteSad: PlayerKey;
	emoteLol: PlayerKey;
	emoteAngry: PlayerKey;
	dash: PlayerKey;
}

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
	dashingPlayer: boolean;

	readonly player1: PlayerSettings;
	readonly player2: PlayerSettings;

	constructor(playerId: 1 | 2, map: MapOption, wind: PlanePosition, ball: BallOption, rotatingPlayer: boolean, spin: boolean, dashingPlayer: boolean,
		player1: WebSocket, player1Keys: PlayerKeys, player2?: WebSocket, player2Keys?: PlayerKeys) {
		this.map = map;
		this.wind = wind;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.spin = spin;
		this.dashingPlayer = dashingPlayer;
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

export { BallOption, PlayerKeys, PlayerSettings, GameSettings, MapOption };
