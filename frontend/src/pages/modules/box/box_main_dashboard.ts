import { getSafeElement } from "../../../utils/getSafeElement";
import { GameStats } from "#shared/types_transfert.js";
import { loadMainBox, MAIN_BOX_BTN_STYLE, MAIN_BOX_SEPARATOR_STYLE } from "../box/box_main_utils";
import { formatScore, formatTime, getGameStats, setGameStats } from "./box_main_dashboard_utils";
import { generatePointList, generateRules } from "./box_main_dashboard_generators";
import { navigateTo } from "../../../routes/navigate";
import { Pages } from "../../../routes/navigate_types";

const COLUMNS_STYLE = `
flex flex-col flex-1 gap-4 h-full min-w-0
`;

const GAME_DASHBOARD_BUTTONS = `
<div class='flex flex-row gap-3'>
	<button id='btn-replay' class='${MAIN_BOX_BTN_STYLE}'>replay</button>
	<button id='btn-home' class='${MAIN_BOX_BTN_STYLE}'>home</button>
</div>
`;

function generateGameDashboard(): string {
	const stats = getGameStats();

	return `
		<div class='flex flex-col h-full max-h-screen w-full justify-center items-center'>
			<div class='flex flex-row gap-4 w-full p-4 pb-2 flex-1 min-h-0'>
				<div class='${COLUMNS_STYLE}'>
					<div class='flex flex-row'>
						<div>Game duration :</div>
						<div>${formatTime(stats.gameTimer)}</div>
					</div>
					<div class='flex flex-row'>
						<div>Score :</div>
						<div>${formatScore(stats)}</div>
					</div>
					<div class='flex flex-row'>
						<p>Opponent :</p>
						<div class='overflow-hidden text-ellipsis'>${stats.player2.name}</div>
						<button id='btn-oppo-profile' class='${MAIN_BOX_BTN_STYLE}'>show his profile</button>
					</div>
				</div>
				<div class='${COLUMNS_STYLE}'>
					<p class=''>points details :</p>
					${generatePointList()}
					<hr class="${MAIN_BOX_SEPARATOR_STYLE}">
					${generateRules()}
				</div>
			</div>
			<div class='shrink-0 h-fit w-full p-4 pt-2'>
				<hr class="${MAIN_BOX_SEPARATOR_STYLE}">
				${GAME_DASHBOARD_BUTTONS}
			</div>
		</div>
	`;
}

function gameDashboardEvents(): void {
	const allElements = getSafeElement('main-box', HTMLElement).querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-replay':
				elem.addEventListener('click', () => navigateTo(Pages.GAME));
				break;
			case 'btn-home':
				elem.addEventListener('click', () => navigateTo(Pages.HOME));
				break;
			case 'btn-oppo-profile':
				elem.addEventListener('click', () => console.log('open opponent\'s profile')); /** @todo oppo's profile */
				break;
			default:
				break;
		}
	});
}

let gameStats: GameStats | null = null;

function openMainDashboard(): void {
	if (!gameStats)
		return;
	setGameStats(gameStats);
	const gameDashboard = generateGameDashboard();
	loadMainBox(gameDashboard, gameDashboardEvents);
}

function loadMainDashboard(stats: GameStats): void {
	gameStats = stats;
	navigateTo(Pages.DASHBOARD);
}

export { loadMainDashboard, openMainDashboard };
