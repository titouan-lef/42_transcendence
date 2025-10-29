export type MapOption = "default" | "random" | "volcano" | "windy" | "frozen" | "rainy";
export type BallOption = "default" | "random" | "invisible" | "tricky" | "heavy" | "snake";
export type PlayerKeys = [KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"]];

 
export class GameSettings {
	readonly map: MapOption;
	readonly ball: BallOption;
	readonly rotatingPlayer:  boolean;
	readonly spin:  boolean;
	readonly player1Keys: PlayerKeys;
	readonly player2Keys: PlayerKeys;

	constructor(map:  MapOption, ball: BallOption, rotatingPlayer: boolean, effects: boolean, 
		player1Keys: PlayerKeys, player2Keys: PlayerKeys) {
		this.map = map;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.spin = effects;
		this.player1Keys = player1Keys;
		this.player2Keys = player2Keys;
	}
}