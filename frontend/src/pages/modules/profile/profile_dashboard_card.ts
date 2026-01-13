import { createParagraphHtml } from "../../../components/paragraph";
import { TranslationKey } from "../../../lang/lang";

const DASHBOARD_CARD_STYLE =  `
flex-1
bg-dark shadow-md shadow-dark
rounded-2xl p-4
flex flex-col justify-start items-start
`;

const DASHBOARD_CARD_TITLE_STYLE = `
text-[20px] text-secondary w-full
`;

function createDashboardCard(title: TranslationKey, print: number | string): string {
	const newPrint = typeof print === 'number' ? print.toFixed(0) : print;

	const dashboardCard = `
	<div class="${DASHBOARD_CARD_STYLE}">
		${createParagraphHtml([title], 'p-' + title.toString(), { 'class': `${DASHBOARD_CARD_TITLE_STYLE}` })}
		<div class="w-full h-full items-center text-[48px] text-center truncate shrink-0 text-ellipsis">${newPrint}</div>
	</div>
	`;

	return dashboardCard;
}

export { createDashboardCard };
