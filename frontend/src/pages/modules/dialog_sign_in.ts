import { createButtonHtml } from "../../components/button.js";
import { createInputHtml } from "../../components/input.js";
import { guestUser } from "../../services/user_management/guest.js";
import { connectUser } from "../../services/user_management/login.js";
import { openDialogSignUp } from "./dialog.js";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE } from "./dialog_style.js";

/** @todo make print-content great. again? */
const SIGN_IN = `
	<form name="Login" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["user_name"], "text", "userID", { "autofocus": "true", "class": `${DIALOG_INPUT_STYLE}` })}
		${createInputHtml(["password"], "password", "password", { "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["sign_in"], `btn-sign-in`, { "class": `${DIALOG_BTN_STYLE}` })}
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	${createButtonHtml(["continue_as_guest"], `btn-guest`, { "class": `${DIALOG_BTN_STYLE}` })}
	${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${DIALOG_BTN_STYLE}` })}
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	<p id="print-content"></p>
`;

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

export { SIGN_IN, signInHandler };
