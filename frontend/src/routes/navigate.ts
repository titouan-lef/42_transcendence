import { openModularPage } from "../pages/modular.js";
import { openProfile } from "../pages/modules/profile/profile.js";
import { GameModals, Modals, Navigation, Pages, isGameModal, isHistorySavedModal, isModal, isPage } from "./navigate_types.js";
import { openWelcomePage } from "../pages/welcome.js";
import { openDialogSignIn, openDialogSignUp } from "src/pages/modules/dialog/dialog_login.js";
import { openDialogAddFriend } from "src/pages/modules/dialog/dialog_add_friend.js";
import { openGamePage } from "src/pages/game_page.js";
import { openDialogGameSelector } from "src/pages/modules/dialog/dialog_game_selector.js";
import { openDialogGameOption } from "src/pages/modules/dialog/dialog_game_options.js";
import { openLeaderboard } from "src/pages/modules/box/box_main_leaderboard.js";
import { closeGame } from "src/game/canvas_creation.js";
import { openDialogWaiting, sendCancelQueue } from "src/pages/modules/dialog/dialog_game_waiting.js";

let historyLengthAtBeginning = 0;

let currentPage: Pages = Pages.WELCOME;
let isWaitingForGame = false;

function navigationGameFound(): void {
	isWaitingForGame = false;
}

function navigationSelector(nav: Navigation): void {
	if (isWaitingForGame)
		sendCancelQueue();
	if (nav !== GameModals.WAITING)
		isWaitingForGame = false;

	console.log(nav);
	if (isPage(nav))
		pageSelector(nav);
	else if (isModal(nav)) {
		if (currentPage !== Pages.HOME)
			pageSelector(Pages.HOME);
		modalSelector(nav);
	} else if (isGameModal(nav)) {
		if (currentPage !== Pages.GAME)
			pageSelector(Pages.GAME);
		gameModalSelector(nav);
	}
}

function pageSelector(page: Pages): void {
	if (currentPage === Pages.GAME && page !== Pages.GAME)
		closeGame();
	currentPage = page;
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
		case Pages.PROFILE:
			openProfile();
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

function gameModalSelector(page: GameModals): void {
	switch(page) {
		case GameModals.WAITING:
			isWaitingForGame = true;
			openDialogWaiting();
			break;
		case GameModals.GAME_QUIT:
			openDialogSignIn();
			break;
		default:
			throw new Error("No such modal");
	}
}

function manageHistoryPushing(nav: Navigation): void {
	const currentNav: Navigation = history.state?.nav;
	if (isGameModal(nav))
		return;
	if (isModal(currentNav) && !isHistorySavedModal(currentNav)) {
		history.replaceState({ nav: nav }, "");
		return;
	}
	if (currentNav === nav)
		return;
	history.pushState({ nav: nav }, "");
}

function navigateTo(nav: Navigation): void {
	manageHistoryPushing(nav);
	navigationSelector(nav);
}

function goBack(): void {
	history.back();
}

function goBackToBeginning(): void {
	history.go(historyLengthAtBeginning - history.length);
	history.replaceState({ nav: Pages.WELCOME }, "");
}

function initPage(nav: Navigation): void {
	history.replaceState({ nav: nav }, ""); // Clears statement to setup back and forward button
	navigationSelector(nav);
	historyLengthAtBeginning = history.length;
}

/**
 * manage navigation for back and forward button
 */
window.addEventListener("popstate", (event: PopStateEvent) => {
	if (event.state?.nav !== undefined)
		navigationSelector(event.state.nav);
});

export { navigateTo, goBack, goBackToBeginning, initPage, navigationGameFound };
