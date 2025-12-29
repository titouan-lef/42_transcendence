import { loadModularPage } from "src/pages/modular";
import { closeDialogID, loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE, DIALOG_SEPARATOR_STYLE } from "./dialog_style";
import { getSafeElement } from "src/utils/getSafeElement";
import { openProfile } from "../profile/profile";
import { openDialogGameSelector, playGame } from "./dialog_game_selector";
import { formatScore, formatTime, getGameStats, setGameStats } from "./dialog_game_dashboard_utils";
import { generatePointList, generateRules } from "./dialog_game_dashboard_generators";
import { GameStats } from "#shared/types_transfert.js";

const GAME_DASHBOARD_BUTTONS = `
<div class='flex flex-row gap-3'>
	<button id='btn-replay' class='${DIALOG_BTN_STYLE}'>replay</button>
	<button id='btn-back-rules' class='${DIALOG_BTN_STYLE}'>change rules</button>
	<button id='btn-profile' class='${DIALOG_BTN_STYLE}'>profile</button>
</div>
`;

function generateGameDashboard(): string {
	const stats = getGameStats();

	return `
		<div class='flex flex-col gap-4'>
			<div class='flex flex-row'>
				<div>Game duration :</div>
				<div>${formatTime(stats.gameTimer)}</div>
			</div>
			<div class='flex flex-row'>
				<div>Score :</div>
				<div>${formatScore(stats)}</div>
				<div>
					<button id='btn-more' class='${DIALOG_BTN_STYLE}'>see more</button>
				</div>
			</div>
			<div>
				<button id='btn-show-rules' class='${DIALOG_BTN_STYLE}'>show game rules</button>
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
			case 'btn-more':
				elem.addEventListener('click', showPoints);
				break;
			case 'btn-show-rules':
				elem.addEventListener('click', showRules);
				break;
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

function showPoints(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	const gameType = modal.dataset.gametype;
	loadDialog(generatePointList(), gameDashboardBtnBackEvents);
	modal.dataset.gametype = gameType;
}

function showRules(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	const gameType = modal.dataset.gametype;
	loadDialog(generateRules(), gameDashboardBtnBackEvents);
	modal.dataset.gametype = gameType;
}

function gameDashboardBtnBackEvents(): void {
	getSafeElement('btn-back', HTMLElement).addEventListener('click', () => openDialogGameDashboard(getGameStats()));
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
	setGameStats(stats);

	loadModularPage();
	loadDialog(generateGameDashboard(), gameDashboardEvents);
	getSafeElement('modal', HTMLDialogElement).dataset.gametype = saveGameType;
}

export { openDialogGameDashboard };
