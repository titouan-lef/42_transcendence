/**
 * @file theme_page.ts
 * This page is just a test page. Testing events and page navigation.
 * DO NOT JUST DELETE THE CODE, IT WILL BE USED IN PROFILE PAGE
 */

import { Themes } from "../../assets/themes/theme.js";

const SELECT_THEME = generateThemeButtons();

function generateThemeButtons(): string {
	const style = `rounded-2xl bg-[var(--color-light)] text-[var(--color-tx-prim)] text-3xl text-center px-10`;

	let selectButtons = `<div class="flex gap-4 flex-wrap justify-center">`;

	Object.values(Themes).forEach(element => {
		selectButtons += `<div id="btn-${element}" class="${style}">${element}</div>`;
	});
	selectButtons += `</div>`;

	return selectButtons;
}

export { SELECT_THEME };
