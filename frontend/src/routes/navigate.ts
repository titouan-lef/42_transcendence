import { openModularPage } from "../pages/modular.js";
import { openProfile } from "../pages/modules/profile/profile.js";
import { Modals, Navigation, Pages, isModal, isPage } from "./navigate_types.js";
import { openWelcomePage } from "../pages/welcome.js";
import { openDialogSignIn, openDialogSignUp } from "src/pages/modules/dialog/dialog_login.js";
import { openDialogAddFriend } from "src/pages/modules/dialog/dialog_add_friend.js";
import { openGamePage } from "src/pages/game_page.js";
import { openDialogGameSelector } from "src/pages/modules/dialog/dialog_game_selector.js";
import { openDialogGameOption } from "src/pages/modules/dialog/dialog_game_options.js";
import { openLeaderboard } from "src/pages/modules/box/box_main_leaderboard.js";

function navigationSelector(nav: Navigation): void {
	console.log(nav);
	if (isPage(nav))
		pageSelector(nav);
	else if (isModal(nav))
		modalSelector(nav);
}

function pageSelector(page: Pages): void {
	switch(page) {
		case Pages.WELCOME:
			openWelcomePage();
			break;
		case Pages.HOME:
			openModularPage();
			break;
		case Pages.LEADERBOARD:
			openLeaderboard();
			break;
		case Pages.GAME:
			openGamePage();
			break;
		default:
			throw new Error("No such page");
	}
}

function modalSelector(page: Modals): void {
	switch(page) {
		case Modals.SIGN_IN:
			openDialogSignIn();
			break;
		case Modals.SIGN_UP:
			openDialogSignUp();
			break;
		case Modals.PROFILE:
			openProfile();
			break;
		case Modals.ADD_FRIEND:
			openDialogAddFriend();
			break;
		case Modals.GAME_SELECTION:
			openDialogGameSelector();
			break;
		case Modals.GAME_OPTIONS:
			openDialogGameOption();
			break;
		default:
			throw new Error("No such modal");
	}
}

function navigateTo(nav: Navigation): void {
	history.pushState({ nav: nav }, "");
	navigationSelector(nav);
}

function goBack(): void {
	history.back();
}

function initPage(nav: Navigation): void {
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
