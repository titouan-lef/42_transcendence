import { setTheme, Themes } from "../../assets/themes/theme";
import { getSafeElement } from "../../utils/getSafeElement";

const SETTINGS_THEME_SELECTOR = `
<div>
	<div class="p-8 text-[20px] font-bold">themes selector</div>
	<div>${generateThemeButtons()}</div>
</div>
`;

function generateThemeButtons(): string {
	const style = `rounded-2xl border-4 border-light bg-primary w-[50px] h-[50px] flex flex-col justify-end items-end gap-[2px]`;

	let selectButtons = `<div class="grid grid-cols-6 grid-rows-2 gap-4 justify-center items-center">`;

	Object.values(Themes).forEach(theme => {
		selectButtons += `<div data-theme="${theme}" id="btn-${theme}" class="${style}">
			<div class="flex-1 m-[5px] w-[10px] h-[10px] rounded-2xl bg-secondary"></div>
			<div class="flex-1 m-[5px] w-[10px] h-[10px] rounded-2xl bg-variant"></div>
			</div>`;
	});
	selectButtons += `</div>`;

	return selectButtons;
}

function generateThemeEvents(): void {
	Object.values(Themes).forEach(theme => {
		const elem = getSafeElement(`btn-${theme}`, HTMLElement);

		elem.addEventListener('click', () => setTheme(theme));
	});
}

export { SETTINGS_THEME_SELECTOR, generateThemeEvents };
