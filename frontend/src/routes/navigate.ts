import { openModularPage } from "../pages/modular.js";
import { openProfile } from "../pages/modules/profile/profile.js";
import {  Modals, Navigation, Pages, getAssociatedPage, isAssociatedPage, isModal, isModularPage, isPage, needToBeConnected } from "./navigate_types.js";
import { openWelcomePage } from "../pages/welcome.js";
import { openDialogSignIn, openDialogSignUp } from "src/pages/modules/dialog/dialog_login.js";
import { openDialogAddFriend } from "src/pages/modules/dialog/dialog_add_friend.js";
import { openGamePage } from "src/pages/game_page.js";
import { openDialogGameSelector } from "src/pages/modules/dialog/dialog_game_selector.js";
import { openDialogGameOption } from "src/pages/modules/dialog/dialog_game_options.js";
import { openLeaderboard } from "src/pages/modules/box/box_main_leaderboard.js";
import { closeGame } from "src/game/canvas_creation.js";
import { openDialogWaiting } from "src/pages/modules/dialog/dialog_game_waiting.js";
import { getCurrentUserInfos } from "src/services/user_management/user_state.js";
import { openDialog2FA, openDialogEmail } from "src/pages/modules/dialog/dialog_2FA.js";
import { openDialogGameQuit } from "src/pages/modules/dialog/dialog_game_quit.js";
import { isRequestSuccessfull, sendGetRequestToBack } from "src/services/api_request.js";
import { openMainHome } from "src/pages/modules/box/box_main_home.js";
import { openMainDashboard } from "src/pages/modules/box/box_main_dashboard.js";

let currentPage: Pages | null = null;
let isWaitingForGame = false;

function navigationGameFound(): void {
	isWaitingForGame = false;
}

async function sendCancelQueue(): Promise<void> {
	const reply = await sendGetRequestToBack("/api/game/cancel_queue");
	if (!isRequestSuccessfull(reply)) {
		console.log("Error:", reply.content);
		return;
	}
	return;
}

function manageParticularPages(page: Pages): void { 
	if (currentPage !== Pages.HOME && (page === Pages.GAME_OPTIONS || page === Pages.GAME_SELECTION)) { // Assure GAME_OPTIONS and GAME_SELECTION got HOME in the back
		pageSelector(Pages.HOME);
	}
}

function navigationSelector(nav: Navigation): boolean {
	if (needToBeConnected(nav) && !getCurrentUserInfos())
		return false;

	if (isWaitingForGame)
		sendCancelQueue();
	if (nav !== Modals.WAITING)
		isWaitingForGame = false;

	if (isPage(nav)) {
		manageParticularPages(nav);
		pageSelector(nav);
		return true;
	}
	if (!isModal(nav))
		return false;
	if (currentPage && !isAssociatedPage(nav, currentPage)) {
		const page = getAssociatedPage(nav);
		navigateTo(page);
	}
	modalSelector(nav);
	return true;
}

function pageSelector(page: Pages): void {
	if (currentPage === Pages.GAME && page !== Pages.GAME)
		closeGame();
	if (isModularPage(page)) {
		openModularPage();
	}
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
			openProfile();
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

function modalSelector(page: Modals): void {
	switch(page) {
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
			isWaitingForGame = true;
			openDialogWaiting();
			break;
		case Modals.GAME_QUIT:
			openDialogGameQuit();
			break;
		default:
			throw new Error("No such modal");
	}
}

function manageHistoryPushing(nav: Navigation): void {
	const currentNav: Navigation = history.state?.nav;
	if(isModal(nav) && getAssociatedPage(nav) === Pages.GAME) // do not add game modals to hisotry
		return;
	if (isModal(currentNav)) {
		history.replaceState({ nav: nav }, ""); // if last nav is a modal, replace in hiroty instead of add it
		return;
	}
	if (currentNav === nav)
		return;
	history.pushState({ nav: nav }, "");
}

function navigateTo(nav: Navigation): void {
	const navigationSuccessfull = navigationSelector(nav);
	if (navigationSuccessfull)
		manageHistoryPushing(nav);
}

function goBack(): void {
	history.back();
}

function goBackToCurrentPage(): void {
	if (!currentPage)
		return;
	navigateTo(currentPage);
}

function goBackToBeginning(): void {
	history.replaceState({}, ""); // prevent any forward in history
	navigateTo(Pages.HOME);
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

export { navigateTo, goBack, goBackToCurrentPage, goBackToBeginning, initPage, navigationGameFound };
