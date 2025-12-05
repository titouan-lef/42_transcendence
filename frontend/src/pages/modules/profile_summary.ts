import { createButtonHtml } from "../../components/button";
import { createParagraphHtml } from "../../components/paragraph";
import { getSafeElement } from "../../utils/getSafeElement";
import { setActiveBtn } from "./profile";
import { createDashboardCard, loadDashboard } from "./profile_dashboard";
import { generateHistory, loadHistory } from "./profile_history";

const SEE_MORE_BTN = `
w-full h-[30px] bg-dark/30 text-[20px] text-variant bg-grad-l-300 from-primary
`;

const SECTION_STYLE = `
min-w-0
px-6 pt-6
flex flex-col justify-start items-centers
`;

const SECTION_TITLE_STYLE = `
text-[26px] font-bold text-center
`;

const SUMMARY_DASHBOARD_STYLE = `
flex-1
bg-dark shadow-md shadow-dark
rounded-2xl p-4
flex flex-col justify-start items-start
`;

/** @todo fetch elo, calculate max of wins for balls and maps */
const SUMMARY = `
<div class="flex flex-col gap-1 h-full">
	<div id='sum-dashboard' class="${SECTION_STYLE}">
		${createParagraphHtml(['dashboard'], 'p-dashboard', { 'class': `${SECTION_TITLE_STYLE}` })}
		<div class="p-4 flex h-[150px] w-full gap-4">
			${createDashboardCard('win_rate', 0)}
			${createDashboardCard('games_played', 0)}
			${createDashboardCard('elo', 500)}
		</div>
	</div>
	${createButtonHtml(['see_more'], 'btn-sum-dashboard', { 'class':`${SEE_MORE_BTN}` })}
	<div id='sum-history' class="${SECTION_STYLE} h-full">
		${createParagraphHtml(['last_games'], 'p-last-games', { 'class': `${SECTION_TITLE_STYLE}` })}
		<div class="flex flex-col justify-start items-center gap-4 h-full w-full p-4">
			${generateHistory(3)}
		</div>
	</div>
	${createButtonHtml(['see_more'], 'btn-sum-history', { 'class':`${SEE_MORE_BTN}` })}
</div>
`;

function loadSummary(): void {
	const content = getSafeElement('profile-content', HTMLElement);

	content.innerHTML = SUMMARY;
	setActiveBtn('btn-summary');

	const dashboardButton = getSafeElement('btn-sum-dashboard', HTMLButtonElement);
	const historyButton = getSafeElement('btn-sum-history', HTMLButtonElement);

	dashboardButton.addEventListener('click', loadDashboard);
	historyButton.addEventListener('click', loadHistory);
}

export { SUMMARY, loadSummary };
