export type MapOption = "default" | "random" | "volcano" | "windy" | "frozen" | "rainy";
export type BallOption = "default" | "random" | "invisible" | "tricky" | "heavy" | "snake";
export type PlayerKeys = [KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"]];

 
export interface PlayerSettings {
	readonly username: string;
	readonly playerKeys: PlayerKeys;
}

export class GameSettings {
	readonly map: MapOption;
	readonly ball: BallOption;
	readonly rotatingPlayer: boolean;
	readonly spin: boolean;
	readonly player1: PlayerSettings;
	readonly player2: PlayerSettings;

	constructor(map: MapOption, ball: BallOption, rotatingPlayer: boolean, effects: boolean, 
		playerName1: string, playerName2: string,
		player1Keys: PlayerKeys, player2Keys: PlayerKeys) {
		this.map = map;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.spin = effects;
		this.player1 = {
			username: playerName1,
			playerKeys: player1Keys
		};
		this.player2 = {
			username: playerName2,
			playerKeys: player2Keys
		};
	}
}