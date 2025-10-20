import { FIRST_PAGE } from "../pages/content/first_page.js";
import { API_PAGE } from "../pages/content/API_page.js";
import { selectTheme } from "../pages/content/theme_page.js";
import { loadEvent } from "./events.js";

export enum PageID {
	FIRST = "first_page",
	API = "api_page",
	THEME = "select_theme",
}

const PAGE_CONTENT: Record<PageID, string> = {
	[PageID.FIRST]: FIRST_PAGE,
	[PageID.API]: API_PAGE,
	[PageID.THEME]: selectTheme,
};

init();
loadPage(PageID.FIRST);

function loadPage(id: PageID): void {
	const element = document.getElementById(id);

	if (!(element instanceof HTMLElement)) {
		throw new Error("cannot find id " + id);
	}

	element.innerHTML = PAGE_CONTENT[id];
	loadEvent(id);
};

function erasePage(id: PageID): void { /** @todo remove events? */
	const element = document.getElementById(id);

	if (!(element instanceof HTMLElement)) {
		throw new Error("cannot find id " + id);
	}

	element.innerHTML = "";
};

export function navigate(currentID: PageID, nextID: PageID) : void {
	loadPage(nextID);
	erasePage(currentID);
	// history.pushState({ nextID }, nextID, `/${nextID}`); /** @todo ne fonctionne pas, a retravailler avec l'update */
}

// window.addEventListener("popstate", (event) => {
// 	const page = (event.state?.page) || "init";
// 	navigate(event.state.currentPage, page.id);
// }); /** @todo ne fonctionne pas, a retravailler avec l'update */

function init(): void {
	const elem = document.getElementById("entrypoint");

	if (!(elem instanceof HTMLElement)) {
		throw new Error("id \"entrypoint\" not found");
	}

	let setupPages = "";

	Object.values(PageID).forEach(element => {
		setupPages += `<div id="${element}"></div>`;
	});
	elem.innerHTML = setupPages;
};
