import { BallOption, MapOption } from "./GameSettings.js";

interface GameStatus {
	env : {
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
		pos : { x: number, y: number, z: number };
	};
	enemy : {
		pseudo: string;
		pos : { x: number, y: number, z: number };
	};
	ball : {
		pos : { x: number, y: number, z: number };
	}
}

interface GlayerControls {
	mov_right: boolean;
	mov_left: boolean;
	rot_right: boolean;
	rot_left: boolean;
	apply_effect: boolean;
}

export { GameStatus, GlayerControls };