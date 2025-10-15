import { API_TESTPAGE } from "./modules/API_testpage.js";
import { FIRST_PAGE } from "./modules/first_page.js";

const NAVIGATE = document.getElementById("navigate");

// if (!NAVIGATE) throw new Error("id navigate not found");

const PAGES: Record<string, string> = {
	init: FIRST_PAGE,
	test: API_TESTPAGE
};

if (NAVIGATE instanceof HTMLElement) {
	NAVIGATE.innerHTML = PAGES.init;
} else {
	throw new Error("id \"navigate\" not found");
}

let currentPage: "init" | "test" = "init";

function goTo(page: "init" | "test") : void {
	currentPage = page;
	if (NAVIGATE instanceof HTMLElement) {
		NAVIGATE.innerHTML = PAGES[page];
	}
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
