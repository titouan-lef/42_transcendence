import { openModularPage } from "../pages/modular.js";
import { openProfile } from "../pages/modules/profile/profile.js";
import { Modals, Navigation, Pages, getAssociatedPage, isAssociatedPage, isModal, isModularPage, isPage, needToBeConnected, needToRejectGuest } from "./navigate_types.js";
import { openWelcomePage } from "../pages/welcome.js";
import { openDialogSignIn, openDialogSignUp } from "../pages/modules/dialog/dialog_login.js";
import { openDialogAddFriend } from "../pages/modules/dialog/dialog_add_friend.js";
import { openGamePage } from "../pages/game_page.js";
import { openDialogGameSelector } from "../pages/modules/dialog/dialog_game_selector.js";
import { openDialogGameOption } from "../pages/modules/dialog/dialog_game_options.js";
import { openLeaderboard } from "../pages/modules/box/box_main_leaderboard.js";
import { closeGame } from "../game/canvas_creation.js";
import { cancelQueue, openDialogWaiting } from "../pages/modules/dialog/dialog_game_waiting.js";
import { getCurrentUserInfos, isGuest } from "../services/user_management/user_state.js";
import { openDialog2FA, openDialogEmail } from "../pages/modules/dialog/dialog_2FA.js";
import { openDialogGameQuit } from "../pages/modules/dialog/dialog_game_quit.js";
import { loadHomePage, openMainHome } from "../pages/modules/box/box_main_home.js";
import { openMainDashboard } from "../pages/modules/box/box_main_dashboard.js";
import { NavigateEvent } from "./navigate.js";
import { ELEM } from "../pages/page.js";

let lastPage: Pages | null = null;
let currentPage: Pages | null = null;
let currentNav: Navigation | null = null;

function manageParticularPages(page: Pages): void {
	if (currentPage !== Pages.HOME && (page === Pages.GAME_OPTIONS || page === Pages.GAME_SELECTION)) // Assure GAME_OPTIONS and GAME_SELECTION got HOME in the back
		pageSelector(Pages.HOME);
	if (page === Pages.PROFILE && currentPage && !isModularPage(currentPage) && currentPage !== Pages.PROFILE) // Assure PROFILE got modular page in the back (does not reload HOME if current page is already PROFILE)
		pageSelector(Pages.HOME);
}

function navigationSelector(nav: Navigation, user?: string): boolean {
	if (needToBeConnected(nav) && !getCurrentUserInfos())
		return false;
	if (isGuest() && needToRejectGuest(nav))
		return false;
	if (currentNav === Pages.WELCOME && nav !== Pages.WELCOME)
		ELEM.removeEventListener('click', loadHomePage);
	if (nav !== Modals.WAITING)
		cancelQueue();
	if (isPage(nav)) {
		manageParticularPages(nav);
		pageSelector(nav, user);
		return true;
	}
	if (!isModal(nav))
		return false;
	if (currentPage && !isAssociatedPage(nav, currentPage)) {
		const page = getAssociatedPage(nav);
		navigation(page);
	}
	modalSelector(nav);
	return true;
}

function pageSelector(page: Pages, user?: string): void {
	if (currentPage === Pages.GAME && page !== Pages.GAME)
		closeGame();
	if (isModularPage(page)) /** @todo do not reload modular if already open (carefull with the backawrd from a modal)*/
		openModularPage();
	if (page !== currentPage)
		lastPage = currentPage;
	currentPage = page;
	switch(page) {
		case Pages.WELCOME:
			openWelcomePage();
			break;
		case Pages.HOME:
			openMainHome();
			break;
		case Pages.LEADERBOARD:
			openLeaderboard();
			break;
		case Pages.DASHBOARD:
			openMainDashboard();
			break;
		case Pages.PROFILE:
			if (user)
				openProfile(user);
			break;
		case Pages.GAME_SELECTION:
			openDialogGameSelector();
			break;
		case Pages.GAME_OPTIONS:
			openDialogGameOption();
			break;
		case Pages.GAME:
			openGamePage();
			break;
		default:
			throw new Error("No such page");
	}
}

function modalSelector(modal: Modals): void {
	switch(modal) {
		// Home
		case Modals.SIGN_IN:
			openDialogSignIn();
			break;
		case Modals.SIGN_UP:
			openDialogSignUp();
			break;
		case Modals.ADD_FRIEND:
			openDialogAddFriend();
			break;
		case Modals.TWO_FA:
			openDialog2FA();
			break;
		// Profile
		case Modals.EMAIL_CONF:
			openDialogEmail();
			break;
		// Game
		case Modals.WAITING:
			openDialogWaiting();
			break;
		case Modals.GAME_QUIT:
			openDialogGameQuit();
			break;
		default:
			throw new Error("No such modal");
	}
}

function manageHistoryPushing(nav: Navigation, user?: string): void {
	if (currentNav === null)
		return;
	if(isModal(nav) && getAssociatedPage(nav) === Pages.GAME) // do not add game modals to history
		return;
	if (isModal(currentNav)) {
		currentNav = nav;
		history.replaceState({ nav: nav, user: user }, ""); // if last nav is a modal, replace in hiroty instead of add it
		return;
	}
	if (currentNav === nav && nav !== Pages.PROFILE)
		return;
	currentNav = nav;
	history.pushState({ nav: nav, user: user }, "");
}

function navigation(nav: Navigation, user?: string): void {
	const navigationSuccessful = navigationSelector(nav, user);
	if (navigationSuccessful)
		manageHistoryPushing(nav, user);
}

document.addEventListener("lastPage", (event: Event) => {
	if (!lastPage)
		return;
	navigation(lastPage);
});

document.addEventListener("navigate", (event: Event) => {
	if (!(event instanceof NavigateEvent))
		return;
	const nav = event.nav;
	const user = event.user;

	navigation(nav, user);
});

function initPage(nav: Navigation): void {
	currentNav = nav;
	history.replaceState({ nav: nav }, ""); // Clears statement to setup back and forward button
	navigationSelector(nav);
}

/**
 * manage navigation for back and forward button
 */
window.addEventListener("popstate", (event: PopStateEvent) => {
	const nav = event.state?.nav;
	const user = event.state?.user;

	if (nav !== undefined)
		if (navigationSelector(nav, user))
			currentNav = nav;
});

export { initPage };
