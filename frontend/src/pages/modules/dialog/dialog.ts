import { SIGN_IN, signInHandler } from "./dialog_sign_in.js";
import { SIGN_UP, signUpHandler } from "./dialog_sign_up.js";
import { ADD_FRIEND, addFriendHandler } from "./dialog_add_friend.js";
import { EMAIL_CONFIRMATION, TWOFA, twoFAHandler } from "./dialog_2FA.js";
import { applyColor } from "../../../utils/applyColor.js";
import { getSafeElement } from "../../../utils/getSafeElement.js";
import { GAME_SELECTOR, gameSelectorHandler } from "./dialog_game_selector.js";
import { GAME_WAITING, gameWaitingHandler } from "./dialog_game_waiting.js";
import { GAME_WAITING_FAILURE, gameWaitingFailureHandler } from "./dialog_game_waiting_failure.js";
import { GAME_QUIT, gameQuitHandler } from "./dialog_game_quit.js";

const DIALOG_MAIN_STYLE = `
	m-auto p-0 rounded-2xl
	w-full max-w-[500px] h-1/2
	backdrop:bg-white/25 backdrop:backdrop-blur-sm bg-transparent
	shadow-[0_0_25px_0] shadow-shadow
`;

const DIALOG_BOX_STYLE = `
	flex justify-center
	m-auto p-6 rounded-2xl
	h-full w-full
	${applyColor('alt')}
`;

const DIALOG_INNER_STYLE = `
	flex flex-col justify-center items-center gap-4
	min-w-[100px] max-w-[250px]
`;

function loadDialog(content: string, handler: (modal: HTMLDialogElement) => void): void {
	const modal = getSafeElement("modal", HTMLDialogElement);
	modal.close();

	modal.className = DIALOG_MAIN_STYLE;
	modal.showModal();
	modal.innerHTML = `
		<div class='${DIALOG_BOX_STYLE}'>
			<div class='${DIALOG_INNER_STYLE}'>
				${content}
			</div>
		</div>
	`;

	handler(modal);
}

function exitDialog(modal: HTMLDialogElement, event: Event): void {
	/** @todo (cancel) do smth to cancel */
	//	if (isWaitingForGame)
	//		sendCancelToBack();
	if (event.target === modal) {
		modal.close();
	}
}

function openDialogEmail(): void {
	const modal = getSafeElement("modal-settings", HTMLDialogElement);
	modal.close();

	modal.className = DIALOG_MAIN_STYLE;
	modal.showModal();
	modal.innerHTML = `
		<div class='${DIALOG_BOX_STYLE}'>
			<div class='${DIALOG_INNER_STYLE}'>
				${EMAIL_CONFIRMATION}
			</div>
		</div>
	`;

	modal.addEventListener('click', (e) => exitDialog(modal, e));
	twoFAHandler(modal);
}

function openDialogGameQuit(): void {
	loadDialog(GAME_QUIT, gameQuitHandler);
}

function openDialogGameSelector(): void {
	loadDialog(GAME_SELECTOR, gameSelectorHandler);
}

function openDialogWaiting(): void {
	loadDialog(GAME_WAITING, gameWaitingHandler);
}

function openDialogNoGameFound(): void {
	loadDialog(GAME_WAITING_FAILURE, gameWaitingFailureHandler);
}

function openDialog2FA(): void {
	loadDialog(TWOFA, twoFAHandler);
}

function openDialogSignIn(): void {
	loadDialog(SIGN_IN, signInHandler);
}

function openDialogSignUp(): void {
	loadDialog(SIGN_UP, signUpHandler);
}

function openDialogAddFriend(): void {
	loadDialog(ADD_FRIEND, addFriendHandler);
}

function closeDialogID(id: string): void {
	const dialog = getSafeElement(id, HTMLDialogElement);
	dialog.close();
}

export { openDialogGameQuit, openDialogNoGameFound, openDialogWaiting, openDialogEmail, closeDialogID, exitDialog, loadDialog, openDialogSignIn, openDialogSignUp, openDialogAddFriend, openDialog2FA, openDialogGameSelector };
