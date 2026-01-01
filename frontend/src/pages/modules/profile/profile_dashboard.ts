import { createParagraphHtml } from "../../../components/paragraph";
import { getSafeElement } from "../../../utils/getSafeElement";
import { setActiveBtn } from "./profile_navbar";
import { createDashboardCard } from "./profile_dashboard_card";
import { configureChart, createDashboardChart, createDashboardChartBox } from "./profile_dashboard_chart";

import { BallOption, MapOption } from "#shared/types_transfert.js";
import { isRequestSuccessfull, sendPostRequestToBack } from "src/services/api_request";
import { getCurrentUserInfos, InfoList } from "src/services/user_management/user_state";

interface EloChart {
	dateList: string[];
	eloList: number[];
}

interface WinrateChart {
	dateList: string[];
	winrateList: number[];
}

interface GoalChart {
	dateList: string[];
	goalList: number[];
}

interface UserDashboardInfos {
	gamesPlayed: number;
	gamesWins: number;
	gamesLooses: number; 
	elo: number;
	goalAverage: number;
	durationAverage: number;//(in seconds)
	preferedBall: BallOption;
	preferedMap: MapOption;
	eloChart: EloChart;
	winrateChart: WinrateChart;
	goalChart: GoalChart;
}

interface UserDashboardInfoBody {
	user: string;
	season: number;
}

/** @todo fetch database infos */
const ARROW_SVG = `
<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
	<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
</svg>
`;

const DASHBOARD_FILTER_STYLE = `
block appearance-none w-full
bg-dark border border-primary hover:border-light
px-4 py-2 pr-8 rounded-2xl
text-secondary cursor-pointer
`;

const DASHBOARD_BOX_STYLE = `
flex flex-col h-full w-full pb-10 pt-4 gap-4
scrollbar-none overflow-y-scroll overflow-hidden
[mask-image:linear-gradient(to_bottom,transparent,black_2%,black_90%,transparent)]
`;

/** @todo bloquer a 3s eason max voir avec les frontist*/
function generateSeasonOptions(maxSeason: number): string {
	let options = `<option value="all">${createParagraphHtml(['all'], 'p-all')}</option>`;

	for (let i: number = maxSeason; i >= 1; i--) {
		options += `<option value="${i}">${i}</option>`;
	}

	return options;
}

function getDashboardFilterHtml(maxSeason: number): string {
	return `
	<div class="relative w-[200px]">
		<div class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-secondary">
			${ARROW_SVG}
		</div>
		<select id="filter" class="${DASHBOARD_FILTER_STYLE}">
		${generateSeasonOptions(maxSeason)}
		</select>
	</div>
`;
}

/** @todo better select/option with divs ? menue is not personnalisable at this time */
function getDashboardPage(maxSeason: number ): string {

	return ( `
	<div class="px-4 flex flex-col h-full w-full">
		<div class='pb-2'>
			${getDashboardFilterHtml(maxSeason)}
		</div>
		<div id="dashboard" class="${DASHBOARD_BOX_STYLE}">
		</div>
	</div>
	`);
}

function getDashboardTable(data: UserDashboardInfos): string {

	return ( `
	<div class="grid grid-cols-3 grid-rows-1 gap-4 h-full w-full">
		${createDashboardCard('wins', data.gamesWins)}
		${createDashboardCard('loses', data.gamesLooses)}
		${createDashboardCard('win_rate', data.gamesPlayed > 0 ? (data.gamesWins / data.gamesPlayed) : 0)}
	</div>
	<div class="">
		${createDashboardChartBox('win_rate_chart')}
	</div>
	<div class="grid grid-cols-3 grid-rows-2 gap-4 h-full w-full">
		${createDashboardCard('elo', data.elo)}	
		${createDashboardCard('games_played', data.gamesPlayed)}	
		${createDashboardCard('goals_avg', data.goalAverage)}	
		${createDashboardCard('games_time', data.durationAverage)}	
		${createDashboardCard('prefered_ball', data.preferedBall)}	
		${createDashboardCard('prefered_map', data.preferedMap)}
	</div>
	<div class="grid grid-cols-2 gap-4 h-full w-full">
		${createDashboardChartBox('elo_chart')}
		${createDashboardChartBox('diff_goals_chart')}
	</div>
	`);
}


async function loadDashboard(): Promise<void> {
	const currentUser: InfoList | null = getCurrentUserInfos();
	if (!currentUser)
		return;

	/** @todo request actual season number */
	const seasonNumber = 3;

	const elem = getSafeElement('profile-content', HTMLElement);
	elem.innerHTML = getDashboardPage(seasonNumber);

	await updateDashboradData();
	const filter = getSafeElement('filter', HTMLSelectElement);
	filter.addEventListener('change', updateDashboradData);

	setActiveBtn('btn-dashboard');
}

async function updateDashboradData(): Promise<void> {
	const currentUser: InfoList | null = getCurrentUserInfos();
	if (!currentUser)
		return;

	const filter = getSafeElement('filter', HTMLSelectElement);
	let targetSeason = Number(filter.value);
	if (!targetSeason)
		targetSeason = -1;
	const reply = await sendPostRequestToBack('/api/user/dashboard', JSON.stringify({ user: currentUser.username, season: targetSeason }));
	if (!isRequestSuccessfull(reply))
		return;

	const data: UserDashboardInfos = JSON.parse(reply.content);
	const elem = getSafeElement('dashboard', HTMLElement);
	elem.innerHTML = getDashboardTable(data);

	createDashboardChart('elo_chart', configureChart(data.eloChart.dateList, data.eloChart.eloList));
	createDashboardChart('win_rate_chart', configureChart(data.winrateChart.dateList, data.winrateChart.winrateList));
	createDashboardChart('diff_goals_chart', configureChart(data.goalChart.dateList, data.goalChart.goalList));
}

export { loadDashboard }; 
