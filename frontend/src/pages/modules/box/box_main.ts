import { createButtonHtml } from "../../../components/button.js";
import { currentUser } from "../../../services/user_management/login.js";
import { applyColor } from "../../../utils/applyColor.js";
import { getSafeElement } from "../../../utils/getSafeElement.js";
import { openDialogGameSelector, openDialogSignIn } from "../dialog/dialog.js";

const MAIN_BOX_STYLE = `
grow
flex justify-center items-center flex-col
rounded-2xl
${applyColor('alt')}
`;

const MAIN_STYLE = `
flex flex-col items-center gap-[10px]
`;

const PONG_STYLE = `
font-jaro
text-[clamp(100px,40vmin,400px)] text-balance leading-none
`;

const PLAY_BTN_STYLE = `
font-park font-bold
rounded-[10px]
text-[20px]
w-[150px] h-[40px]
${applyColor()}
`;

/** @todo animation is not working with z-index, see later */
// animate-pulse

const MAIN_BOX = `
<main id="main" class="${MAIN_BOX_STYLE}">
	<div class="${MAIN_STYLE}">
		<h1 class="${PONG_STYLE}">PONG</h1>
		${createButtonHtml(["play"], "btn-play", { "class": `${PLAY_BTN_STYLE}` })}
	</div>
</main>
`;

function openGameOption(): void {
	if (currentUser)
		openDialogGameSelector();
	else
		openDialogSignIn(); /** @todo (optionnal) QOL: when sign in or continue as guest -> open play directly */
}

function mainBoxEvents(): void {
	const play = getSafeElement('btn-play', HTMLElement);

	play.addEventListener('click', openGameOption);
}

export { MAIN_BOX, mainBoxEvents };
