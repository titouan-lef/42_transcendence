import { createButtonHtml } from "../../../components/button";
import { createParagraphHtml } from "../../../components/paragraph";
import { getSafeElement } from "../../../utils/getSafeElement";
import { getDashboardData } from "./profile_dashboard";
import { createDashboardCard } from "./profile_dashboard_card";
import { generateHistory, getHistoryData } from "./profile_history";
import { setActiveBtn } from "./profile_navbar";
import { GameHistoryWithAvatar, UserDashboardInfos } from "#shared/HTTP";
import { navigateTo } from "src/routes/navigate";
import { Pages } from "src/routes/navigate_types";

const SEE_MORE_BTN_STYLE = `
w-9/10 h-[30px] bg-dark/30 text-[20px] text-variant bg-grad-l-300 from-primary
`;

const SECTION_STYLE = `
min-w-0
px-6 pt-6
flex flex-col justify-start items-centers
`;

const SECTION_TITLE_STYLE = `
text-[26px] font-bold text-center
`;

const HISTORY_DEEP = 3;

function getSummaryTable(history: GameHistoryWithAvatar[], data: UserDashboardInfos): string {
	return (`
	<div class="flex flex-col gap-1 h-full">
		<div id='sum-dashboard' class="${SECTION_STYLE}">
			${createParagraphHtml(['dashboard'], 'p-dashboard', { 'class': `${SECTION_TITLE_STYLE}` })}
			<div class="p-4 flex h-[150px] w-full gap-4">
				${createDashboardCard('win_rate', data.gamesPlayed ? data.gamesWins / data.gamesPlayed * 100 : 0)}
				${createDashboardCard('games_played', data.gamesPlayed)}
				${data.elo > 0 ? createDashboardCard('elo', data.elo) : createDashboardCard('elo', '-')}
			</div>
		</div>
		${createButtonHtml(['see_more'], 'btn-sum-dashboard', { 'class': `${SEE_MORE_BTN_STYLE}` })}
		<div id='sum-history' class="${SECTION_STYLE} h-full flex-1 min-h-0">
			${createParagraphHtml(['last_games'], 'p-last-games', { 'class': `${SECTION_TITLE_STYLE}` })}
			<div class="flex flex-col justify-start items-center gap-4 h-full w-full p-4 flex-1 min-h-0 scrollbar-none overflow-y-scroll overflow-hidden">
				${generateHistory(history, HISTORY_DEEP)}
			</div>
		</div>
		${createButtonHtml(['see_more'], 'btn-sum-history', { 'class': `${SEE_MORE_BTN_STYLE}` })}
	</div>
	`);
}

async function loadSummary(): Promise<void> {
	setActiveBtn('btn-summary');

	const dataHist = await getHistoryData();
	const dataDash = await getDashboardData();
	const element = getSafeElement('profile-content', HTMLElement);

	element.innerHTML = getSummaryTable(dataHist, dataDash);
	dataHist.slice(0, HISTORY_DEEP).forEach((game) => {
		const element = getSafeElement(`${game.opponentUsername}-nickname`, HTMLElement);
		element.addEventListener('click', () => navigateTo(Pages.PROFILE, game.opponentUsername));
	});

	const dashboardButton = getSafeElement('btn-sum-dashboard', HTMLButtonElement);
	const historyButton = getSafeElement('btn-sum-history', HTMLButtonElement);

	dashboardButton.addEventListener('click', () => document.dispatchEvent(new Event('dashboard')));
	historyButton.addEventListener('click', () => document.dispatchEvent(new Event('history')));
}

export { loadSummary };
