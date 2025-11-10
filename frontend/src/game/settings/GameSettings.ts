export type MapOption = "default" | "random" | "volcano" | "sky" | "desert";
export type BallOption = "default" | "random" | "invisible" | "tricky" | "pulse" | "snake";
export type PlayerKeys = [KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"], KeyboardEvent["code"]];

 
export class GameSettings {
	readonly map: MapOption;
	readonly ball: BallOption;
	readonly rotatingPlayer:  boolean;
	readonly spin:  boolean;

	/**@todo this wont be here with serverside */
	readonly playerId: 1 | 2;
	readonly player1Keys: PlayerKeys;
	readonly player2Keys: PlayerKeys;

	constructor(playerId: 1 | 2, map:  MapOption, ball: BallOption, rotatingPlayer: boolean, spin: boolean, 
		player1Keys: PlayerKeys, player2Keys: PlayerKeys) {
		this.map = map;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.spin = spin;
		this.player1Keys = player1Keys;
		this.player2Keys = player2Keys;
		this.playerId = playerId;
	}
}