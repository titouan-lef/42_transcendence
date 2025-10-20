import { Themes } from "../../themes/theme.js";

let selectTheme = `<div class="flex gap-4 flex-wrap justify-center">`;

const CLASS_CSS = `rounded-2xl bg-[var(--color-light)] text-[var(--color-tx-prim)] text-3xl text-center px-10`;

Object.values(Themes).forEach(element => {
	selectTheme += `<div id="btn-${element}" class="${CLASS_CSS}">${element}</div>`;
});

selectTheme += `</div>`;

export { selectTheme };

// export function loadThemeSelector(): void {
// 	const selectThemeID = document.getElementById("select_theme");

// 	if (selectThemeID instanceof HTMLElement) {
// 		selectThemeID.innerHTML = selectTheme;
// 	} else {
// 		throw new Error("id \"select_theme\" not found");
// 	}
// }
