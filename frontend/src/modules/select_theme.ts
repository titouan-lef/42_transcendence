import { THEMES } from "../theme.js";

let selectTheme = "";

const CLASS_THEME = "rounded-2xl bg-[var(--color-light)] text-[var(--color-tx-prim)] text-3xl text-center px-10";

Object.values(THEMES).forEach(element => {
	selectTheme += `<div id="btn-` + element + `" class="` + CLASS_THEME + `">` + element + `</div>`;
});

export { selectTheme };

const SELECT_THEME_ID = document.getElementById("select_theme");

if (SELECT_THEME_ID instanceof HTMLElement) {
	SELECT_THEME_ID.innerHTML = selectTheme;
} else {
	throw new Error("id \"select_theme\" not found");
}
