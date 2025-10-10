export type MapOption = "default" | "random" | "volcano" | "windy" | "frozen" | "rainy";
export type BallOption = "default" | "random" | "invisible" | "tricky" | "heavy" | "snake";

export class GameSettings {
	readonly map: MapOption;
	readonly ball: BallOption;
	readonly rotatingPlayer:  boolean;
	readonly effects:  boolean;
	//readonly jump:  true | false;

	constructor(map:  MapOption, ball: BallOption, rotatingPlayer: boolean, effects: boolean) {
		this.map = map;
		this.ball = ball;
		this.rotatingPlayer = rotatingPlayer;
		this.effects = effects;
	}
}