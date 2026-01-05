import { createParagraphHtml } from "../../../components/paragraph";
import { getSafeElement } from "../../../utils/getSafeElement";
import { setActiveBtn } from "./profile_navbar";
import { createDashboardCard } from "./profile_dashboard_card";
import { configureChart, createDashboardChart, createDashboardChartBox } from "./profile_dashboard_chart";
import { UserDashboardInfos } from "#shared/HTTP";
import { isRequestSuccessfull, sendGetRequestToBack, sendPostRequestToBack } from "../../../services/api_request";
import { getCurrentUserInfos, InfoList } from "../../../services/user_management/user_state";
import { getFilterHtml } from "../../../components/selectionMenu";

const DASHBOARD_BOX_STYLE = `
flex flex-col h-full w-full pb-10 pt-4 gap-4
scrollbar-none overflow-y-scroll overflow-hidden
[mask-image:linear-gradient(to_bottom,transparent,black_2%,black_90%,transparent)]
`;

/** @todo better select/option with divs ? menue is not personnalisable at this time */
function getDashboardPage(maxSeason: number ): string {

	return ( `
	<div class="px-4 flex flex-col h-full w-full">
		<div class='pb-2'>
			${getFilterHtml(maxSeason, true)}
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
		${createDashboardCard('win_rate', data.gamesPlayed > 0 ? (data.gamesWins / data.gamesPlayed) * 100 : 0)}
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
	<div class="">
		${createDashboardChartBox('elo_chart')}
	</div>
	`);
}

async function updateDashboardData(): Promise<void> {
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
}

async function loadDashboard(): Promise<void> {
	setActiveBtn('btn-dashboard');

	const currentUser: InfoList | null = getCurrentUserInfos();
	if (!currentUser)
		return;
	const reply = await sendGetRequestToBack('/api/season');
	if (!isRequestSuccessfull(reply))
		return;
	const seasonNumber: number = JSON.parse(reply.content);

	const elem = getSafeElement('profile-content', HTMLElement);
	elem.innerHTML = getDashboardPage(seasonNumber);

	const filter = getSafeElement('filter', HTMLSelectElement);
	filter.addEventListener('change', updateDashboardData);
	await updateDashboardData();

}

export { loadDashboard }; 
