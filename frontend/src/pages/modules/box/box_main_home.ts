import { createButtonHtml } from "src/components/button";
import { getCurrentUserInfos } from "src/services/user_management/user_state";
import { openDialogGameSelector } from "../dialog/dialog_game_selector";
import { openDialogSignIn } from "../dialog/dialog_login";
import { getSafeElement } from "src/utils/getSafeElement";
import { loadMainBox, MAIN_BOX_BTN_STYLE } from "./box_main_utils";

const MAIN_HOME_STYLE = `
flex flex-col items-center gap-[10px]
`;

const PONG_STYLE = `
font-jaro
text-[clamp(100px,40vmin,400px)] text-balance leading-none
`;

/** @todo animation is not working with z-index, see later */
// animate-pulse
const PLAY_BTN_STYLE = `
${MAIN_BOX_BTN_STYLE}
`;

const MAIN_HOME = `
<div class="${MAIN_HOME_STYLE}">
	<h1 class="${PONG_STYLE}">PONG</h1>
	${createButtonHtml(["play"], "btn-play", { "class": `${PLAY_BTN_STYLE}` })}
</div>
`;

function openGameOption(): void {
	if (getCurrentUserInfos())
		openDialogGameSelector();
	else
		openDialogSignIn(); /** @todo (optionnal) QOL: when sign in or continue as guest -> open play directly */
}

function mainBoxEvents(): void {
	const play = getSafeElement('btn-play', HTMLElement);

	play.addEventListener('click', openGameOption);
}

function loadMainHome(): void {
	loadMainBox(MAIN_HOME, mainBoxEvents);
}

export { loadMainHome };
