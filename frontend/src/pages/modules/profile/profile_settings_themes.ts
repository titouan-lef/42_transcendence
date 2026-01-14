import { THEMES_LIST } from "../../../assets/themes/themes.js";
import { updateTheme } from "../../../assets/themes/theme.js";
import { getSafeElement } from "../../../utils/getSafeElement.js";

const SETTINGS_THEME_SELECTOR = `
<div class='flex flex-col h-full w-full bg-light/10 rounded-2xl p-2'>
	<div class="p-8 text-[20px] font-bold">themes selector</div>
	${generateThemeButtons()}
</div>
`;

function generateThemeButtons(): string {
	const style = `rounded-2xl border-4 border-light bg-primary size-12 flex flex-col justify-end items-end gap-[2px]`;

	let selectButtons = `<div class="grid grid-cols-6 grid-rows-2 place-items-center gap-4 flex-1 min-w-0">`;

	THEMES_LIST.forEach(theme => {
		selectButtons += `<div data-theme="${theme}" id="btn-${theme}" class="${style}">
			<div class="flex-1 m-[5px] w-[10px] h-[10px] rounded-2xl bg-secondary"></div>
			<div class="flex-1 m-[5px] w-[10px] h-[10px] rounded-2xl bg-variant"></div>
			</div>`;
	});
	selectButtons += `</div>`;

	return selectButtons;
}

function generateThemeEvents(): void {
	THEMES_LIST.forEach(theme => {
		const elem = getSafeElement(`btn-${theme}`, HTMLElement);
		elem?.addEventListener('click', () => updateTheme(theme));
	});
}

export { SETTINGS_THEME_SELECTOR, generateThemeEvents };
