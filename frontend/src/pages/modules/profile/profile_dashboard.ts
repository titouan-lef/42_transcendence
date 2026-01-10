import { getSafeElement } from "../../../utils/getSafeElement";
import { setActiveBtn } from "./profile_navbar";
import { createDashboardCard } from "./profile_dashboard_card";
import { configureChart, createDashboardChart, createDashboardChartBox } from "./profile_dashboard_chart";
import { isRequestSuccessfull, sendGetRequestToBack, sendPostRequestToBack } from "../../../services/api_request";
import { getFilterHtml } from "../../../components/selectionMenu";
import { UserDashboardInfoBody, UserDashboardInfos } from "#shared/HTTP";

const DASHBOARD_BOX_STYLE = `
flex flex-col h-full w-full pb-10 pt-4 gap-4
scrollbar-none overflow-y-scroll overflow-hidden
[mask-image:linear-gradient(to_bottom,transparent,black_2%,black_90%,transparent)]
`;

const SELECT_NAME = `dashboard-filter`;

let dashboardData: UserDashboardInfos;

/** @todo better select/option with divs ? menue is not personnalisable at this time */
function getDashboardPage(maxSeason: number ): string {

	return ( `
	<div class="px-4 flex flex-col h-full w-full">
		<div class='pb-2'>
			${getFilterHtml(SELECT_NAME, maxSeason, true)}
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
		${data.elo > 0 ? createDashboardCard('elo', data.elo) : createDashboardCard('elo', '-')}
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

async function fetchDashboardData(user: string): Promise<void> {
	let targetSeason = -1;
	try {
		const filter = getSafeElement(SELECT_NAME, HTMLSelectElement);
		targetSeason = Number(filter.value);
		if (Number.isNaN(targetSeason))
			targetSeason = -1;
	} catch {}
	const body: UserDashboardInfoBody = { user: user, season: targetSeason };
	const reply = await sendPostRequestToBack('/api/user/dashboard', JSON.stringify(body));
	if (!isRequestSuccessfull(reply))
		return;

	dashboardData = JSON.parse(reply.content);
}

async function getDashboardData(): Promise<UserDashboardInfos> {
	return dashboardData;
}

async function loadDashboardData(): Promise<void> {
	const elem = getSafeElement('dashboard', HTMLElement);
	elem.innerHTML = getDashboardTable(dashboardData);

	createDashboardChart('elo_chart', configureChart(dashboardData.eloChart));
	createDashboardChart('win_rate_chart', configureChart(dashboardData.winrateChart, true));
}

async function updateDashboardData(user: string): Promise<void> {
	await fetchDashboardData(user);
	await loadDashboardData();
}

let seasonNumber: number;

async function fetchSeasonData(): Promise<void> {
	const reply = await sendGetRequestToBack('/api/season');
	if (!isRequestSuccessfull(reply))
		return;
	seasonNumber = JSON.parse(reply.content);
}

async function loadDashboard(user: string): Promise<void> {
	setActiveBtn('btn-dashboard');

	const elem = getSafeElement('profile-content', HTMLElement);
	elem.innerHTML = getDashboardPage(seasonNumber);

	const filter = getSafeElement(SELECT_NAME, HTMLSelectElement);
	filter.addEventListener('change', () => updateDashboardData(user));
	loadDashboardData();
}

export { loadDashboard, fetchDashboardData, getDashboardData, fetchSeasonData };
