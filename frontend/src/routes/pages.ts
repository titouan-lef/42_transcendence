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

/**
 * @warning please use erasePage(PageID) before you load a page
 */
function loadPage(id: PageID): void {
	const elem = document.getElementById(id);

	if (!elem) {
		throw new Error("cannot find id " + id);
	}

	elem.innerHTML = PAGE_CONTENT[id];
	loadEvent(id);
	currentPage = id;
};

function erasePage(id: PageID): void {
	const elem = document.getElementById(id);

	if (!elem) {
		throw new Error("cannot find id " + id);
	}

	elem.innerHTML = "";
};

/**
 * Changes page from current to nextID and manages back and forward button.
 * @param nextID the page we want to go
 */
export function navigate(nextID: PageID): void {
	if (nextID === currentPage) {
		return ;
	}

	erasePage(currentPage);
	loadPage(nextID);
	history.pushState({ page: nextID }, ""); // Adding the page to history
}

/**
 * manage navigation for back and forward button
 */
window.addEventListener("popstate", (event) => {
	const page = (event.state?.page) || PageID.FIRST;
	erasePage(currentPage);
	loadPage(page);
});

/**
 * Fills the <div id="entrypoint"></div> in the html file to prepare all pages.
 */
function init(): void {
	const elem = document.getElementById("entrypoint");

	if (!elem) {
		throw new Error("id \"entrypoint\" not found");
	}

	let setupPages = "";

	Object.values(PageID).forEach(id => {
		setupPages += `<div id="${id}"></div>`;
	});
	elem.innerHTML = setupPages;
	history.replaceState({page: currentPage}, ""); // Clears statement to setup back and forward button
};
