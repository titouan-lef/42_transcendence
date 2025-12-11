import { createParagraphHtml } from "../../../components/paragraph";
import { getSafeElement } from "../../../utils/getSafeElement";
import { setActiveBtn } from "./profile_navbar";
import { createDashboardCard } from "./profile_dashboard_card";
import { configureChart, createDashboardChart, createDashboardChartBox } from "./profile_dashboard_chart";

/** @todo fetch database infos */
const LABEL_DATE = [ 'date1', 'date2', 'date3', 'date4', 'date5', 'date6', 'date7' ];
const DATA_ELO = [ 500, 542, 536, 529, 571, 613, 655 ];
const DATA_WINRATE = [ 50, 66, 7, 54, 42, 48, 48 ];
const DATA_GOALS = [ 3, -1, 4, 0, -4, 5, 8 ];

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

const DASHBOARD_FILTER_OPTIONS = `
<option value="all">${createParagraphHtml(['all'], 'p-all')}</option>
<option value="s3">${createParagraphHtml(['s3'], 'p-s3')}</option>
<option value="s2">${createParagraphHtml(['s2'], 'p-s2')}</option>
<option value="s1">${createParagraphHtml(['s1'], 'p-s1')}</option>
`;

const DASHBOARD_FILTER = `
<div class="relative w-[200px]">
	<div class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-secondary">
		${ARROW_SVG}
	</div>
	<select id="filter" class="${DASHBOARD_FILTER_STYLE}">
		${DASHBOARD_FILTER_OPTIONS}
	</select>
</div>
`;

const DASHBOARD_BOX_STYLE = `
flex flex-col h-full w-full pb-10 pt-4 gap-4
scrollbar-none overflow-y-scroll overflow-hidden
[mask-image:linear-gradient(to_bottom,transparent,black_2%,black_90%,transparent)]
`;

/** @todo better select/option with divs ? menue is not personnalisable at this time */
const DASHBOARD = `
<div class="px-4 flex flex-col h-full w-full">
	<div class='pb-2'>
		${DASHBOARD_FILTER}
	</div>
	<div class="${DASHBOARD_BOX_STYLE}">
		<div class="grid grid-cols-3 grid-rows-1 gap-4 h-full w-full">
			${createDashboardCard('wins', 0)}
			${createDashboardCard('loses', 0)}
			${createDashboardCard('win_rate', 0)}
		</div>
		<div class="">
			${createDashboardChartBox('win_rate_chart')}
		</div>
		<div class="grid grid-cols-3 grid-rows-2 gap-4 h-full w-full">
			${createDashboardCard('elo', 500)}
			${createDashboardCard('games_played', 0)}
			${createDashboardCard('goals_avg', 0)}
			${createDashboardCard('games_time', 0)}
			${createDashboardCard('prefered_ball', 'snake')}
			${createDashboardCard('prefered_map', 'volcano')}
		</div>
		<div class="grid grid-cols-2 gap-4 h-full w-full">
			${createDashboardChartBox('elo_chart')}
			${createDashboardChartBox('diff_goals_chart')}
		</div>
	</div>
</div>
`;

function loadDashboard(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = DASHBOARD;
	setActiveBtn('btn-dashboard');

	createDashboardChart('elo_chart', configureChart(LABEL_DATE, DATA_ELO));
	createDashboardChart('win_rate_chart', configureChart(LABEL_DATE, DATA_WINRATE));
	createDashboardChart('diff_goals_chart', configureChart(LABEL_DATE, DATA_GOALS));
}

export { DASHBOARD, loadDashboard };
