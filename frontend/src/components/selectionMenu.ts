import { createParagraphHtml } from "./paragraph.js";

const ARROW_SVG = `
<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
	<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
</svg>
`;

const FILTER_STYLE = `
block appearance-none w-full
text-secondary cursor-pointer
`;

function generateSeasonOptions(maxSeason: number, allOption: boolean): string {

	let options = "";
	if (allOption)
		options += `<option value="all">${createParagraphHtml(['all'], 'p-all')}</option>`;

	for (let i: number = maxSeason; i >= 1; i--) {
		const selected = i === maxSeason ? ' selected' : '';
		options += `<option value="${i}"${selected}>${i}</option>`;
	}

	return options;
}

function getFilterHtml(id: string, maxSeason: number, allOption = false): string {
	return `
	<div class="w-[200px] flex flex-row justify-between bg-dark border border-primary hover:border-light
	px-4 py-2 rounded-2xl">
		<select id="${id}" class="${FILTER_STYLE}">
			${generateSeasonOptions(maxSeason, allOption)}
		</select>
		<div class="pointer-events-none flex items-center text-secondary">
			${ARROW_SVG}
		</div>
	</div>
`;
}

export { getFilterHtml };
