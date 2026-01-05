import { getCurrentUserInfos, InfoList } from "../../../services/user_management/user_state";
import { createButtonHtml } from "../../../components/button";
import { createParagraphHtml } from "../../../components/paragraph";
import { getSafeElement } from "../../../utils/getSafeElement";
import { getDashboardData, loadDashboard } from "./profile_dashboard";
import { createDashboardCard } from "./profile_dashboard_card";
import { generateHistory, getHistoryData, loadHistory } from "./profile_history";
import { setActiveBtn } from "./profile_navbar";
import { isRequestSuccessfull, sendPostRequestToBack } from "../../../services/api_request";
import { GameHistoryWithAvatar, UserBody, UserDashboardInfoBody, UserDashboardInfos } from "#shared/HTTP";

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

/** @todo fetch elo, calculate max of wins for balls and maps */
function getSummaryTable(history: GameHistoryWithAvatar[], data: UserDashboardInfos): string {
	console.log(data);
	return (`
	<div class="flex flex-col gap-1 h-full pr-[190px]">
		<div id='sum-dashboard' class="${SECTION_STYLE}">
			${createParagraphHtml(['dashboard'], 'p-dashboard', { 'class': `${SECTION_TITLE_STYLE}` })}
			<div class="p-4 flex h-[150px] w-full gap-4">
				${createDashboardCard('win_rate', data.gamesPlayed ? data.gamesWins / data.gamesPlayed * 100 : 0)}
				${createDashboardCard('games_played', data.gamesPlayed)}
				${createDashboardCard('elo', data.elo)}
			</div>
		</div>
		${createButtonHtml(['see_more'], 'btn-sum-dashboard', { 'class': `${SEE_MORE_BTN_STYLE}` })}
		<div id='sum-history' class="${SECTION_STYLE} h-full flex-1 min-h-0">
			${createParagraphHtml(['last_games'], 'p-last-games', { 'class': `${SECTION_TITLE_STYLE}` })}
			<div class="flex flex-col justify-start items-center gap-4 h-full w-full p-4 flex-1 min-h-0 scrollbar-none overflow-y-scroll overflow-hidden">
				${generateHistory(history, 3)}
			</div>
		</div>
		${createButtonHtml(['see_more'], 'btn-sum-history', { 'class': `${SEE_MORE_BTN_STYLE}` })}
	</div>
	`);
}

async function loadSummary(): Promise<void> {
	const currentUser: InfoList | null = getCurrentUserInfos();
	if (!currentUser)
		return;

	setActiveBtn('btn-summary');

	const dataHist = await getHistoryData();
	const dataDash = await getDashboardData();
	const element = getSafeElement('profile-content', HTMLElement);

	element.innerHTML = getSummaryTable(dataHist, dataDash);

	const dashboardButton = getSafeElement('btn-sum-dashboard', HTMLButtonElement);
	const historyButton = getSafeElement('btn-sum-history', HTMLButtonElement);

	dashboardButton.addEventListener('click', () => document.dispatchEvent(new Event('dashboard')));
	historyButton.addEventListener('click', () => document.dispatchEvent(new Event('history')));
}

export { loadSummary };
