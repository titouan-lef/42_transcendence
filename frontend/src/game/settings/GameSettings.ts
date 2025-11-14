export type MapOption = "default" | "random" | "volcano" | "sky" | "desert";
export type BallOption = "default" | "random" | "invisible" | "tricky" | "pulse" | "snake";
export type PlayerKeys = [KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"]];

export interface PlayerSettings {
	readonly playerId: 1 | 2;
	readonly playerKeys: PlayerKeys;
}

export class GameSettings {
	readonly map: MapOption;
	readonly ball: BallOption;
	readonly rotatingPlayer: boolean;
	readonly spin: boolean;

	readonly myId: 1 | 2;
	readonly player1: PlayerSettings;
	readonly player2: PlayerSettings;

	constructor(myId: 1 | 2, map:  MapOption, ball: BallOption, rotatingPlayer: boolean, spin: boolean,
		player1Keys: PlayerKeys, player2Keys: PlayerKeys) {
		this.map = map;
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