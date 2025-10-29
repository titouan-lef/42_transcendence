import { addHandler } from "../routes/event.js";
import { navigate, PageID } from "../routes/page.js";

const MAIN_STYLE = "w-full md:w-[85%] p-6";
const ASIDE_STYLE = "w-full md:w-[15%] p-6";
const BLOC_STYLE = "h-full rounded-2xl";

const MAIN_MENU = `
<main class="${MAIN_STYLE}">
	<div class="${BLOC_STYLE}">
		gauche
		<input id="btn-api" type="button" value="API test" class="btn btn-user"/>
	</div>
</main>
<aside class="${ASIDE_STYLE}">
	<div class="${BLOC_STYLE}">
		droite
		<input id="btn-api" type="button" value="API test" class="btn btn-user"/>
	</div>
</aside>
`;

function mainMenuEvents(): void {
	addHandler("btn-api", "click", () => navigate(PageID.API));
};

export { MAIN_MENU, mainMenuEvents };
