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

let currentPage = PageID.FIRST;

init();
loadPage(currentPage);

function loadPage(id: PageID): void {
	const element = document.getElementById(id);

	if (!(element instanceof HTMLElement)) {
		throw new Error("cannot find id " + id);
	}

	element.innerHTML = PAGE_CONTENT[id];
	loadEvent(id);
	currentPage = id;
};

function erasePage(id: PageID): void { /** @todo remove events? */
	const element = document.getElementById(id);

	if (!(element instanceof HTMLElement)) {
		throw new Error("cannot find id " + id);
	}

	element.innerHTML = "";
};

export function navigate(currentID: PageID, nextID: PageID) : void {
	if (nextID === currentID) {
		return ;
	}

	loadPage(nextID);
	erasePage(currentID);
	history.pushState({ page: nextID }, ""); // add state to save navigation for back and forward buttons
}

/**
 * manage navigation for back and forward button
 */
window.addEventListener("popstate", (event) => {
	const page = (event.state?.page) || PageID.FIRST;
	erasePage(currentPage);
	loadPage(page);
});

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
	history.replaceState({page: currentPage}, ""); //init statement to setup back and forward button
};
