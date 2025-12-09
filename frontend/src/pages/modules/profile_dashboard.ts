import { createParagraphHtml } from "../../components/paragraph";
import { TranslationKey } from "../../lang/lang";
import { loadThemeColors, ThemeColors } from "../../utils/applyColor";
import { getCSSVariable } from "../../utils/getCSSVariable";
import { getSafeElement } from "../../utils/getSafeElement";
import { setActiveBtn } from "./profile";
import { Chart, ChartConfiguration } from "chart.js/auto";

/** @todo fetch database infos */
const LABEL_DATE = [ 'date1', 'date2', 'date3', 'date4', 'date5', 'date6', 'date7' ];
const DATA_ELO = [ 500, 542, 536, 529, 571, 613, 655 ];

const DASHBOARD_CARD_STYLE =  `
flex-1
bg-dark shadow-md shadow-dark
rounded-2xl p-4
flex flex-col justify-start items-start
`;

const DASHBOARD_CARD_TITLE_STYLE = `
text-[20px] text-secondary w-full
`;

const DASHBOARD_CHART_CARD_STYLE = `
flex-1
bg-dark shadow-md shadow-dark
rounded-2xl p-4
flex flex-col justify-start items-start
`;

/** @todo better select/option with divs ? menu is not personnalisable at this time */
const DASHBOARD = `
<div class="px-4 flex flex-col h-full w-full">
	<div class='pb-2'>
		<div class="relative w-[200px]">
			<div class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-secondary">
				<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
				</svg>
			</div>
			<select id="filter" class="
				block appearance-none w-full
				bg-dark border border-primary hover:border-light
				px-4 py-2 pr-8 rounded-2xl
				text-secondary cursor-pointer
			">
				<option value="all">${createParagraphHtml(['all'], 'p-all')}</option>
				<option value="s3">${createParagraphHtml(['s3'], 'p-s3')}</option>
				<option value="s2">${createParagraphHtml(['s2'], 'p-s2')}</option>
				<option value="s1">${createParagraphHtml(['s1'], 'p-s1')}</option>
			</select>
		</div>
	</div>
	<div class="flex flex-col h-full w-full pb-10 pt-4 gap-4 scrollbar-none
	overflow-y-scroll overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_2%,black_90%,transparent)]">
		<div class="grid grid-cols-3 grid-rows-1 gap-4 h-full w-full">
			${createDashboardCard('wins', 0)}
			${createDashboardCard('loses', 0)}
			${createDashboardCard('win_rate', 0)}
		</div>
		<div class="">
			${createDashboardChartCard('win_rate_chart')}
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
			${createDashboardChartCard('elo_chart')}
			${createDashboardChartCard('diff_goals_chart')}
		</div>
	</div>
</div>
`;

function createDashboardCard(title: TranslationKey, print: number | string): string {
	const dashboardCard = `
	<div class="${DASHBOARD_CARD_STYLE}">
		${createParagraphHtml([title], 'p-' + title.toString(), { 'class': `${DASHBOARD_CARD_TITLE_STYLE}` })}
		<div class="w-full h-full items-center text-[48px] text-center truncate text-ellipsis">
			${print}
		</div>
	</div>
	`;

	return dashboardCard;
}

function createDashboardChartCard(title: TranslationKey): string {
	const dashboardChart = `
	<div class="${DASHBOARD_CHART_CARD_STYLE}">
		${createParagraphHtml([title], 'p-' + title.toString(), { 'class': `${DASHBOARD_CARD_TITLE_STYLE}` })}
		<div class="w-full h-full items-center text-[48px] text-center truncate text-ellipsis">
			<canvas id='chart-${title}'>
			</canvas>
		</div>
	</div>
	`;

	return dashboardChart;
}

function createDashboardChart(title: TranslationKey, labels: string[], dataset: number[]): void {
	const canvas = getSafeElement('chart-' + title, HTMLCanvasElement);
	const tColors: ThemeColors = loadThemeColors();

	const config: ChartConfiguration = {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: 'elo',
				data: dataset,
				borderColor: tColors.primary,
				backgroundColor: tColors.darker + 55,
				pointBorderColor: tColors.primary,
				pointBackgroundColor: tColors.variant,
				tension: 0,
				fill: true,
				pointRadius: 4
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false }
			},
			scales: {
				x: {
					grid: {
						color: tColors.darker + 70,
					},
					ticks: {
						color: tColors.secondary,
						font: {
							family: getCSSVariable('--font-jbm'),
							size: 10
						}
					}
				},
				y: {
					grid: {
						color: tColors.darker + 70,
					},
					ticks: {
						color: tColors.secondary,
						font: {
							family: getCSSVariable('--font-jbm'),
							size: 10
						}
					},
					beginAtZero: true
				}
			}
		}
	};

	new Chart(canvas, config);
}

function loadDashboard(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = DASHBOARD;
	setActiveBtn('btn-dashboard');

	/** @todo database fetch info for these functions calls */
	createDashboardChart('elo_chart', LABEL_DATE, DATA_ELO);
	createDashboardChart('win_rate_chart', LABEL_DATE, DATA_ELO);
	createDashboardChart('diff_goals_chart', LABEL_DATE, DATA_ELO);

	/** @todo events */
}

export { DASHBOARD, loadDashboard, createDashboardCard };
