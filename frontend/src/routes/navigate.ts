import { openModularPage } from "../pages/modular.js";
import { openProfile } from "../pages/modules/profile/profile.js";
import { MODALS, NAVIGATION, PAGES, isModal, isPage } from "./navigate_types.js";
import { openWelcomePage } from "../pages/welcome.js";
import { openDialogSignIn, openDialogSignUp } from "src/pages/modules/dialog/dialog_login.js";
import { openLeaderboard } from "src/pages/modules/box/box_main_leaderboard.js";

function navigationSelector(nav: NAVIGATION): void {
	console.log(nav);
	if (isPage(nav))
		pageSelector(nav);
	else if (isModal(nav))
		modalSelector(nav);
}

function pageSelector(page: PAGES): void {
	switch(page) {
		case PAGES.WELCOME:
			openWelcomePage();
			break;
		case PAGES.HOME:
			openModularPage();
			break;
		case PAGES.LEADERBOARD:
			openLeaderboard();
			break;
		default:
			throw new Error("No such page");
	}
}

function modalSelector(page: MODALS): void {
	switch(page) {
		case MODALS.SIGN_IN:
			openDialogSignIn();
			break;
		case MODALS.SIGN_UP:
			openDialogSignUp();
			break;
		case MODALS.PROFILE:
			openProfile();
			break;
		default:
			throw new Error("No such modal");
	}
}

function navigateTo(nav: NAVIGATION): void {
	history.pushState({ nav: nav }, "");
	navigationSelector(nav);
}

function goBack(): void {
	history.back();
}

function initPage(nav: NAVIGATION): void {
	history.replaceState({ nav: nav }, ""); // Clears statement to setup back and forward button
	navigationSelector(nav);
}

/**
 * manage navigation for back and forward button
 */
window.addEventListener("popstate", (event: PopStateEvent) => {
	if (event.state?.nav !== undefined)
		navigationSelector(event.state.nav);
});

export { navigateTo, goBack, initPage };
