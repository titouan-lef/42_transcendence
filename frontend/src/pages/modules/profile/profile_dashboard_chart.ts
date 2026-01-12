import { Chart, ChartConfiguration } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import { createParagraphHtml } from "../../../components/paragraph";
import { TranslationKey } from "../../../lang/lang";
import { getSafeElement } from "../../../utils/getSafeElement";
import { loadThemeColors } from "../../../utils/applyColor";
import { getCSSVariable } from "../../../utils/getCSSVariable";
import { DataChartType } from "#shared/HTTP";

const DASHBOARD_CHART_TITLE_STYLE = `
text-[20px] text-secondary w-full
`;

const DASHBOARD_CHART_MAIN_STYLE = `
flex-1
bg-dark shadow-md shadow-dark
rounded-2xl p-4
flex flex-col justify-start items-start
`;

const DASHBOARD_CHART_BOX_STYLE = `
w-full h-full items-center
text-[48px] text-center truncate text-ellipsis
`;

function createDashboardChartBox(title: TranslationKey): string {
	const dashboardChart = `
	<div class="${DASHBOARD_CHART_MAIN_STYLE}">
		${createParagraphHtml([title], 'p-' + title.toString(), { 'class': `${DASHBOARD_CHART_TITLE_STYLE}` })}
		<div class="${DASHBOARD_CHART_BOX_STYLE}">
			<canvas id='chart-${title}'>
			</canvas>
		</div>
	</div>
	`;

	return dashboardChart;
}

function createDashboardChart(title: TranslationKey, config: ChartConfiguration): void {
	const canvas = getSafeElement('chart-' + title, HTMLCanvasElement);

	new Chart(canvas, config);
}

function configureChart(dataset: DataChartType[], enforceYAxis = false): ChartConfiguration {
	const tColors = loadThemeColors();
	
	let lower: number = dataset.at(0)?.y ?? 0;
	let upper: number = dataset.at(0)?.y ?? 0;

	if (enforceYAxis) {
		lower = 0;
		upper = 100;
	} else {
		for (const data of dataset) {
			if (data.y < lower)
				lower = data.y;
			if (data.y > upper)
				upper = data.y;
		}
		let diff = upper - lower;
		if (diff === 0)
			diff = 100;
		lower = Math.round(lower - diff / 10);
		upper = Math.round(upper + diff / 10);;
	}

	return {
		type: 'line',
		data: {
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
					type: 'time',
					time: {
						tooltipFormat: 'yyyy-MM-dd HH:mm',
						unit: 'second',
						displayFormats: {
							second: 'HH:mm',
							minute: 'HH:mm',
							hour: 'HH:mm'
						}
					},
					grid: {
						color: tColors.darker + 70
					},
					ticks: {
						source: 'auto',
						maxTicksLimit: 10,
						autoSkip: true,
						color: tColors.secondary,
						font: {
							family: getCSSVariable('--font-jbm'),
							size: 10
						}
					}
				},
				y: {
					grid: {
						color: tColors.darker + 70
					},
					ticks: {
						color: tColors.secondary,
						font: {
							family: getCSSVariable('--font-jbm'),
							size: 10
						}
					},
					min: lower,
					max: upper
				}
			}
		}
	};
}

export { createDashboardChartBox, createDashboardChart, configureChart };
