import { SIGN_IN, signInHandler } from "./dialog_sign_in.js";
import { SIGN_UP, signUpHandler } from "./dialog_sign_up.js";
import { ADD_FRIEND, addFriendHandler } from "./dialog_add_friend.js";
import { EMAIL_CONFIRMATION, TWOFA, twoFAHandler } from "./dialog_2FA.js";
import { applyColor } from "../../../utils/applyColor.js";
import { getSafeElement } from "../../../utils/getSafeElement.js";

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

export { exitDialog, loadDialog, openDialogSignIn, openDialogSignUp, openDialogAddFriend, openDialog2FA, openDialogEmail };
