import { GameStats } from "#shared/types_transfert.js";
import { loadModularPage } from "src/pages/modular";
import { loadDialog } from "./dialog";

// type MapOption = "default" | "volcano" | "sky" | "desert";
// type BallOption = "default" | "invisible" | "tricky" | "pulse" | "snake" | "canon";

// interface Point {
// 	ball: BallOption,
// 	map: MapOption,
// 	timer: number,
// 	goaler: 1 | 2
// }

// interface Rules {
// 	ballOptions: BallOption[],
// 	mapOptions: MapOption[],
// 	rotatingPlayer: boolean,
// 	spin: boolean,
// 	dashingPlayer: boolean,
// 	windAffectsBall: boolean,
// 	canonCount: number
// }

// interface PlayerInfo {
// 	name: string,
// 	score: number
// }

// interface GameStats {
// 	player1: PlayerInfo,
// 	player2: PlayerInfo,
// 	gameTimer: number,
// 	points: Point[],
// 	rules: Rules
// }

function formatTime(time: number): string {
	return `${~~(time / 60)} min ${(time % 60).toString().padStart(2, '0')} sec`;
}

function formatScore(stats: GameStats): string {
	return `${stats.player1.name} ${stats.player1.score} | ${stats.player2.score} ${stats.player2.name}`;
}

function generateGameDashboard(stats: GameStats): string {
	return `
		<div class='flex flex-col gap-4'>
			<div class='flex flex-row'>
				<div>Game duration :</div>
				<div>${formatTime(stats.gameTimer)}</div>
			</div>
			<div class='flex flex-row'>
				<div>Score :</div>
				<div>${formatScore(stats)}</div>
			</div>
		</div>
	`;
}

function openDialogGameDashboard(stats: GameStats): void {
	loadModularPage();
	loadDialog(generateGameDashboard(stats), () => {});
}

export { openDialogGameDashboard };
