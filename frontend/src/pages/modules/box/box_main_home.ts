import { createButtonHtml } from "../../../components/button";
import { getCurrentUserInfos } from "../../../services/user_management/user_state";
import { loadDialogSignIn } from "../dialog/dialog_login";
import { getSafeElement } from "../../../utils/getSafeElement";
import { loadMainBox, MAIN_BOX_BTN_STYLE } from "./box_main_utils";
import { loadLeaderboard } from "./box_main_leaderboard";
import { loadDialogGameSelector } from "../dialog/dialog_game_selector";
import { navigateTo } from "../../../routes/navigate";
import { Pages } from "../../../routes/navigate_types";

const MAIN_HOME_STYLE = `
flex flex-col items-center gap-[10px]
`;

const PONG_STYLE = `
font-jaro
text-[clamp(100px,40vmin,400px)] text-balance leading-none
`;

const PLAY_BTN_STYLE = `
${MAIN_BOX_BTN_STYLE}
`;

const MAIN_HOME = `
<div class="${MAIN_HOME_STYLE}">
	<h1 class="${PONG_STYLE}">PONG</h1>
	<div class='flex flex-row gap-4'>
		${createButtonHtml(["play"], "btn-play", { "class": `${PLAY_BTN_STYLE}` })}
		${createButtonHtml(["leaderboard"], "btn-leaderboard", { "class": `${MAIN_BOX_BTN_STYLE}` })}
	</div>
</div>
`;

function openGameOption(): void {
	if (getCurrentUserInfos())
		loadDialogGameSelector();
	else
		loadDialogSignIn();
}

function mainBoxEvents(): void {
	const play = getSafeElement('btn-play', HTMLElement);
	const leaderboard = getSafeElement('btn-leaderboard', HTMLElement);
	if (play)
		play.addEventListener('click', openGameOption);
	if (leaderboard)
		leaderboard.addEventListener('click', loadLeaderboard);
}

function openMainHome(): void {
	loadMainBox(MAIN_HOME, mainBoxEvents);
}

function loadHomePage(): void {
	navigateTo(Pages.HOME);
}

export { openMainHome, loadHomePage };
