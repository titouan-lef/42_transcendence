/**
 * @file theme_page.ts
 * this page is just a test page: testing events and page navigation
 * DO NOT JUST DELETE THE CODE, IT WILL BE USED IN PROFILE PAGE
 */

import { Themes } from "../../assets/themes/theme.js";

let selectTheme = `<div class="flex gap-4 flex-wrap justify-center">`;

const CLASS_CSS = `rounded-2xl bg-[var(--color-light)] text-[var(--color-tx-prim)] text-3xl text-center px-10`;

Object.values(Themes).forEach(element => {
	selectTheme += `<div id="btn-${element}" class="${CLASS_CSS}">${element}</div>`;
}); //generates all buttons to change theme

selectTheme += `</div>`;

export { selectTheme };
