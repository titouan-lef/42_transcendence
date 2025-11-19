import { loadPage } from "../routes/page";
import { getSafeElement } from "../utils/getSafeElement";
import { GAME_PAGE, gamePageEvents } from "./game_page";
import { ASIDE_BOX } from "./modules/box_aside";
import { MAIN_BOX } from "./modules/box_main";
import { loadDialog } from "./modules/dialog";
import { SIGN_IN } from "./modules/dialog_sign_in";
import { SIGN_UP } from "./modules/dialog_sign_up";

const ROW_STYLE = `
flex flex-row gap-[10px]
p-[10px]
min-h-screen max-h-screen
bg-dark
`;

const MODULAR = `
<dialog id="modal"></dialog>
<div id="modular-content" class="${ROW_STYLE}"></div>
`;

function openDialogSignIn(event: Event): void {
	loadDialog(() => {}, SIGN_IN);
}

function openDialogSignUp(event: Event): void {
	loadDialog(() => {}, SIGN_UP);
}

function goToGamePage(): void {
	loadPage(GAME_PAGE, gamePageEvents);
}

function modularEvents(): void {
	const content = getSafeElement('modular-content', HTMLElement);

	content.innerHTML = MAIN_BOX + ASIDE_BOX;
	const signIn = getSafeElement('btn-sign-in', HTMLElement);
	const signUp = getSafeElement('btn-sign-up', HTMLElement);
	const play = getSafeElement('main-play-btn', HTMLElement);

	play.addEventListener('click', goToGamePage);
	signIn.addEventListener('click', openDialogSignIn);
	signUp.addEventListener('click', openDialogSignUp);
}

export { MODULAR, modularEvents };
