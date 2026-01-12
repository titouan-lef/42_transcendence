import { getSafeElement } from "../../../utils/getSafeElement";
import { GameStats } from "#shared/types_transfert.js";
import { loadMainBox, MAIN_BOX_BTN_STYLE } from "../box/box_main_utils";
import { formatScore, formatTime, getGameStats, setGameStats } from "./box_main_dashboard_utils";
import { generatePointList, generateRules } from "./box_main_dashboard_generators";
import { navigateTo } from "../../../routes/navigate";
import { GameTypes, Pages } from "../../../routes/navigate_types";
import { applyColor, Color } from "../../../utils/applyColor";
import { getGameType } from "../../../game/gameType";
import { GUEST_NAME } from "#shared/constant";

const COLUMNS_STYLE = `
flex flex-col flex-1 gap-4 h-full min-w-0 min-h-0 scrollbar-none overflow-scroll
`;

const GAME_DASHBOARD_BUTTONS = `
<div class='flex flex-row gap-3'>
	<button id='btn-replay' class='${MAIN_BOX_BTN_STYLE}'>replay</button>
	<button id='btn-home' class='${MAIN_BOX_BTN_STYLE}'>home</button>
</div>
`;

function generateGameDashboard(): string {
	const stats = getGameStats();
	if (stats === undefined)
		return "";

	return `
		<div class='flex flex-col h-full max-h-screen w-full justify-center items-center'>
			<div class='flex flex-row gap-4 w-full p-4 flex-1 min-h-0 h-full'>
				<div class='${COLUMNS_STYLE}'>
					${showGameResults(stats)}
					${generateRules()}
					<div class='shrink-0 h-fit w-full p-2'>
						${GAME_DASHBOARD_BUTTONS}
					</div>
				</div>
				<div class='${COLUMNS_STYLE}'>
					<p class='text-2xl font-bold p-8'>points details</p>
					${generatePointList()}
				</div>
			</div>
		</div>
	`;
}

const BTN_SHOW_OPPO_PROFILE = `
<button id='btn-oppo-profile' class='font-park font-bold rounded-[10px] text-[20px] w-[200px] h-[40px] ${applyColor()}'>
	show profile
</button>
`;

const GAME_RESULTS_TITLE_STYLE = `
text-2xl font-bold p-8 max-w-[550px] truncate
`;

function showGameResults(stats: GameStats): string {
	const gameType = getGameType();
	const victory = stats.player1.score > stats.player2.score ? 1 : 2;
	let color: Color = 'win';
	let winner: string;
	if (gameType === GameTypes.RANKED || gameType === GameTypes.AI) {
		if (victory === 1)
			winner = `<p class='text-[35px]'>Victory</p>`;
		else {
			winner = `<p class='text-[35px]'>Defeat</p>`;
			color = 'lose';
		}
	} else
		winner = `<p class='text-[35px]'>Winner: Player${victory}</p>`;

	const gameResults = `
	<div class='${applyColor(color)} px-8 py-4 flex flex-col rounded-2xl bg-grad-l from-dark'>
		${winner}
		<div class='flex flex-row w-full h-fit justify-between items-center'>
			<div class='text-[80px] font-bold w-fit mr-20 text-balance'>${formatScore(stats)}</div>
			<div class='text-[35px] text-variant'>${formatTime(stats.gameTimer)}</div>
		</div>
	</div>
	`;

	if (gameType === GameTypes.RANKED && stats.player2.name !== GUEST_NAME) {
		return `
		<div class='flex flex-row gap-4 justify-between items-center'>
			<div class='${GAME_RESULTS_TITLE_STYLE}'>ranked game result VS ${stats.player2.name}</div>
			${BTN_SHOW_OPPO_PROFILE}
		</div>
		${gameResults}
		`;
	} else if (gameType === GameTypes.AI || gameType === GameTypes.LOCAL) {
		return `
		<div class='${GAME_RESULTS_TITLE_STYLE}'>${gameType} game result</div>
		${gameResults}
		`;
	}
	return '';
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
				elem.addEventListener('click', () => navigateTo(Pages.PROFILE, getGameStats()?.player2.name));
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
