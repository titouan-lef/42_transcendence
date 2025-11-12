import { BallOption, MapOption } from "./GameSettings.js";

interface Position {
	x: number;
	y: number;
	z: number
}

/**@todo split positions for rendering and data used only once (options, score, pseudos...) */
/**@todo change string `status` into an enum */
interface GameStatus {
	status: string;
	options : {
		map: MapOption;
		ball: BallOption;
		rotatingPlayer: boolean;
		spin: boolean;
	};
	state : {
		start_time : number;
		current_time : number;
		score : { player: number, enemy: number };
	};
	player : {
		pseudo: string;
		pos : Position;
	};
	enemy : {
		pseudo: string;
		pos : Position;
	};
	ball : {
		pos : Position;
	}
}

interface PlayerControls {
	mov_right: boolean;
	mov_left: boolean;
	rot_right: boolean;
	rot_left: boolean;
	apply_effect: boolean;
}

export { Position, GameStatus, PlayerControls };