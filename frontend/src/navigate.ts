import { API_TESTPAGE } from "./modules/API_testpage.js";
import { FIRST_PAGE } from "./modules/first_page.js";
import { hello, test } from "./api_requests.js";

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

let currentPage = "init";

function goTo(page: string) : void {
	currentPage = page;
	if (NAVIGATE instanceof HTMLElement) {
		NAVIGATE.innerHTML = PAGES[page];
	}
	history.pushState({ page }, page, `/${page}`);
}

const EVENTS = new Map<string, () => void>([
	["btn-hello", hello],
	["btn-test", test]
]);

document.addEventListener("click", (event) => {
	const target = event.target;

	if (!target) {
		return ;
	} else if (target instanceof HTMLElement) {
		EVENTS.get(target.id)?.();
	} else {
		console.log("problem with HTMLElement");
	}
});

document.body.addEventListener("click", () => {
	if (currentPage === "init") {
		goTo("test");
	}
});

window.addEventListener("popstate", (event) => {
	const page = (event.state?.page) || "init";
	goTo(page);
});
