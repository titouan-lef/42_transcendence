import { GameStats } from "#shared/types_transfert.js";
import { loadModularPage } from "src/pages/modular";
import { closeDialogID, loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE, DIALOG_SEPARATOR_STYLE } from "./dialog_style";
import { getSafeElement } from "src/utils/getSafeElement";
import { openProfile } from "../profile/profile";
import { openDialogGameSelector, playGame } from "./dialog_game_selector";

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

const GAME_DASHBOARD_BUTTONS = `
<div class='flex flex-row gap-3'>
	<button id='btn-replay' class='${DIALOG_BTN_STYLE}'>replay</button>
	<button id='btn-back-rules' class='${DIALOG_BTN_STYLE}'>change rules</button>
	<button id='btn-profile' class='${DIALOG_BTN_STYLE}'>profile</button>
</div>
`;

function formatTime(time: number): string {
	return `${~~(time / 60)} min ${(time % 60).toString().padStart(2, '0')} sec`;
}

function formatScore(stats: GameStats): string {
	return `${stats.player1.name} [ ${stats.player1.score} | ${stats.player2.score} ] ${stats.player2.name}`;
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
		<hr class="${DIALOG_SEPARATOR_STYLE}">
		${GAME_DASHBOARD_BUTTONS}
	`;
}

function gameDashboardEvents(): void {
	const allElements = getSafeElement('modal', HTMLDialogElement).querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-replay':
				elem.addEventListener('click', gameDashboardReplayEvent);
				break;
			case 'btn-back-rules':
				elem.addEventListener('click', openDialogGameSelector);
				break;
			case 'btn-profile':
				elem.addEventListener('click', gameDashboardProfileEvent);
				break;
			default:
				break;
		}
	});
}

function gameDashboardReplayEvent(): void {
	const gameType = getSafeElement('modal', HTMLDialogElement).dataset.gametype;

	if (gameType && (gameType === 'local' || gameType === 'ai' || gameType === 'ranked'))
		playGame(gameType);
}

function gameDashboardProfileEvent(): void {
	closeDialogID('modal');
	openProfile();
}

function openDialogGameDashboard(stats: GameStats): void {
	const saveGameType = getSafeElement('modal', HTMLDialogElement).dataset.gametype;

	loadModularPage();
	loadDialog(generateGameDashboard(stats), gameDashboardEvents);
	getSafeElement('modal', HTMLDialogElement).dataset.gametype = saveGameType;
}

export { openDialogGameDashboard };
