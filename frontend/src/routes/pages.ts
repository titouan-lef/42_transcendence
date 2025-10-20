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
 * opens a page based on pageID, please use erasePage(PageID) before you load a page
 */
function loadPage(id: PageID): void {
	const element = document.getElementById(id);

	if (!(element instanceof HTMLElement)) {
		throw new Error("cannot find id " + id);
	}

	element.innerHTML = PAGE_CONTENT[id];
	loadEvent(id);
	currentPage = id;
};

/**
 * replaces page content by "".
 */
function erasePage(id: PageID): void {
	const element = document.getElementById(id);

	if (!(element instanceof HTMLElement)) {
		throw new Error("cannot find id " + id);
	}

	element.innerHTML = "";
};

/**
 * Changes page from currentID to nextID and manages back and forward button.
 * @param currentID the page we want to clear
 * @param nextID the page we want to go
 */
export function navigate(currentID: PageID, nextID: PageID): void {
	if (nextID === currentID) {
		return ;
	}

	erasePage(currentID);
	loadPage(nextID);
	history.pushState({ page: nextID }, ""); // adding the page to history
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
 * fills the <div id="entrypoint"></div> in the html file to prepare all pages.
 */
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
	history.replaceState({page: currentPage}, ""); //clears statement to setup back and forward button
};
