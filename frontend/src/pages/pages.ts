import { FIRST_PAGE } from "./content/first_page.js";
import { API_PAGE } from "./content/API_page.js";

export enum PAGE_ID {
	FIRST = "first_page",
	API = "api_page",
}

const PAGE_CONTENT: Record<PAGE_ID, string> = {
	[PAGE_ID.FIRST]: FIRST_PAGE,
	[PAGE_ID.API]: API_PAGE,
};

init();
loadPage(PAGE_ID.FIRST);

function loadPage(id: PAGE_ID): void {
	const element = document.getElementById(id);

	if (!(element instanceof HTMLElement)) {
		throw new Error("cannot find id " + id);
	}

	element.innerHTML = PAGE_CONTENT[id];
	loadEvent(id);
};

function erasePage(id: PAGE_ID): void {
	const element = document.getElementById(id);

	if (!(element instanceof HTMLElement)) {
		throw new Error("cannot find id " + id);
	}

	element.innerHTML = "";
};

export function navigate(currentID: PAGE_ID, nextID: PAGE_ID) : void {
	erasePage(currentID);
	loadPage(nextID);
	history.pushState({ nextID }, nextID, `/${nextID}`); /** @todo ne fonctionne pas, a retravailler avec l'update */
}

window.addEventListener("popstate", (event) => {
	const page = (event.state?.page) || "init";
	navigate(event.state.currentPage, page.id);
}); /** @todo ne fonctionne pas, a retravailler avec l'update */

function init(): void {
	const elem = document.getElementById("entrypoint");

	if (!(elem instanceof HTMLElement)) {
		throw new Error("id \"entrypoint\" not found");
	}

	let setupPages = "";

	Object.values(PAGE_ID).forEach(element => { setupPages += `<div id="${element}"></div>`; });
	elem.innerHTML = setupPages;
};
