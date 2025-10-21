/**
 * @file theme_page.ts
 * This page is just a test page. Testing events and page navigation.
 * DO NOT JUST DELETE THE CODE, IT WILL BE USED IN PROFILE PAGE
 */

import { Themes } from "../../assets/themes/theme.js";

const CLASS_CSS = `rounded-2xl bg-[var(--color-light)] text-[var(--color-tx-prim)] text-3xl text-center px-10`;

let selectTheme: string;

generateThemeButtons();

function generateThemeButtons(): void {
	selectTheme = `<div class="flex gap-4 flex-wrap justify-center">`;

	Object.values(Themes).forEach(element => {
		selectTheme += `<div id="btn-${element}" class="${CLASS_CSS}">${element}</div>`;
	});
	selectTheme += `</div>`;
}

export { selectTheme };
