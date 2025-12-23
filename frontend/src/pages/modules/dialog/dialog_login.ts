import { newUser } from "src/services/user_management/create_account";
import { guestUser } from "src/services/user_management/guest";
import { connectUser } from "src/services/user_management/login";
import { loadDialog } from "./dialog";
import { SIGN_IN } from "./dialog_login_sign_in";
import { SIGN_UP } from "./dialog_login_sign_up";

function signUpHandler(modal: HTMLDialogElement): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-sign-in':
				elem.addEventListener('click', openDialogSignIn);
				break;
			case 'btn-sign-up':
				elem.addEventListener('click', newUser);
				break;
			default:
				break;
		}
	});
}

function signInHandler(modal: HTMLDialogElement): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-sign-in':
				elem.addEventListener('click', connectUser);
				break;
			case 'btn-sign-up':
				elem.addEventListener('click', openDialogSignUp);
				break;
			case 'btn-guest':
				elem.addEventListener('click', guestUser);
				break;
			default:
				break;
		}
	});
}

function openDialogSignUp(): void {
	loadDialog(SIGN_UP, signUpHandler);
}

function openDialogSignIn(): void {
	loadDialog(SIGN_IN, signInHandler);
}

export { openDialogSignIn, openDialogSignUp };
