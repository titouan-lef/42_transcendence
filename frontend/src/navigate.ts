import { API_TESTPAGE } from "./modules/API_testpage.js";
import { FIRST_PAGE } from "./modules/first_page.js";

const NAVIGATE = document.getElementById("navigate");

const PAGES: Record<string, string> = {
	init: FIRST_PAGE,
	test: API_TESTPAGE
};

NAVIGATE.innerHTML = PAGES.init;

let currentPage: "init" | "test" = "init";

function goTo(page: "init" | "test") : void {
	currentPage = page;
	NAVIGATE.innerHTML = PAGES[page];
	history.pushState({ page }, page, `/${page}`);
}

document.body.addEventListener("click", () => {
	const nextPage = currentPage === "init" ? "test" : "init";
	goTo(nextPage);
});

window.addEventListener("popstate", (event) => {
	const page = (event.state?.page) || "init";
	goTo(page);
});
