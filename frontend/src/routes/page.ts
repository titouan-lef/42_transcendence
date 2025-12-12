import { setTheme } from "../assets/themes/theme.js";
import { WELCOME, welcomeEvents } from "../pages/welcome.js";
import { getUserInfos } from "../services/user_management/login.js";
import { getSafeElement } from "../utils/getSafeElement.js";

const ELEM_ID = 'main-content';
const ELEM = getSafeElement(ELEM_ID, HTMLElement);

/** @todo manage back and forward buttons */
// let currentPage: HTMLElement;

function loadPage(page: string, eventLoader: () => void): void {
	/** @todo clearLangListeners(); */
	ELEM.innerHTML = page;
	eventLoader();
	// currentPage = ELEM;
	// history.pushState({ page: currentPage.innerHTML }, "");
};

/**
 * manage navigation for back and forward button
 */
// window.addEventListener("popstate", (event) => {
// 	const page = (event.state?.page) || WELCOME;

// 	loadPage(page, () => {});
// });

/**
 * Fills the div with ep id in the html file to prepare all pages.
 */
async function init(): Promise<void> {
	await getUserInfos();
	setTheme();
	loadPage(WELCOME, welcomeEvents);
	// history.replaceState({ page: ELEM.innerHTML }, ""); // Clears statement to setup back and forward button
};

export { ELEM, init, loadPage };
