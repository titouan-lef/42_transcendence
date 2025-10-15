import { API_TESTPAGE } from "./modules/API_testpage.js";
import { FIRST_PAGE } from "./modules/first_page.js";

const PAGES: Record<string, string> = {
	init: FIRST_PAGE,
	test: API_TESTPAGE
};

const NAVIGATE = document.getElementById("navigate");

if (NAVIGATE instanceof HTMLElement) {
	NAVIGATE.innerHTML = PAGES.init;
} else {
	throw new Error("id \"navigate\" not found");
}

export function goTo(page: string) : void {
	if (NAVIGATE instanceof HTMLElement) {
		NAVIGATE.innerHTML = PAGES[page];
	}
	history.pushState({ page }, page, `/${page}`);
}
