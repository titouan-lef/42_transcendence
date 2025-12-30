import { loadModularPage } from "src/pages/modular";
import { getSafeElement } from "src/utils/getSafeElement";
import { GameStats } from "#shared/types_transfert.js";
import { loadMainBox, MAIN_BOX_BTN_STYLE, MAIN_BOX_SEPARATOR_STYLE } from "../box/box_main_utils";
import { loadMainHome } from "../box/box_main_home";
import { formatScore, formatTime, getGameStats, setGameStats } from "./box_main_dashboard_utils";
import { generatePointList, generateRules } from "./box_main_dashboard_generators";

const GAME_DASHBOARD_BUTTONS = `
<div class='flex flex-row gap-3'>
	<button id='btn-replay' class='${MAIN_BOX_BTN_STYLE}'>replay</button>
	<button id='btn-home' class='${MAIN_BOX_BTN_STYLE}'>home</button>
</div>
`;

function generateGameDashboard(): string {
	const stats = getGameStats();

	return `
		<div class='flex flex-row gap-4'>
			<div class='flex flex-col gap-4'>
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
					<div>${stats.player2.name}</div>
					<button id='btn-oppo-profile' class='${MAIN_BOX_BTN_STYLE}'>show his profile</button>
				</div>
			</div>
			<div class='flex flex-col gap-4'>
				<p>points details :</p>
				${generatePointList()}
				<hr class="${MAIN_BOX_SEPARATOR_STYLE}">
				${generateRules()}
			</div>
		</div>
		<hr class="${MAIN_BOX_SEPARATOR_STYLE}">
		${GAME_DASHBOARD_BUTTONS}
	`;
}

function gameDashboardEvents(): void {
	const allElements = getSafeElement('main-box', HTMLElement).querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-replay':
				elem.addEventListener('click', () => console.log('launch new same game behavior')); /** @todo link with new nav replay system */
				break;
			case 'btn-home':
				elem.addEventListener('click', loadMainHome);
				break;
			case 'btn-oppo-profile':
				elem.addEventListener('click', () => console.log('open opponent\'s profile')); /** @todo oppo's profile */
				break;
			default:
				break;
		}
	});
}

function loadMainDashboard(stats: GameStats): void {
	loadModularPage();
	setGameStats(stats);

	loadMainBox(generateGameDashboard(), gameDashboardEvents);
}

export { loadMainDashboard };
