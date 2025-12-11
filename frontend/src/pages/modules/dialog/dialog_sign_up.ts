import { createButtonHtml } from "../../../components/button";
import { createInputHtml } from "../../../components/input";
import { newUser } from "../../../services/user_management/create_account";
import { openDialogSignIn } from "./dialog";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE } from "./dialog_style";

/** @todo make print-content great. again? */
const SIGN_UP = `
	<form name="Register" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["user_name"], "text", "userID", { "autofocus": "true", "class": `${DIALOG_INPUT_STYLE}` })}
		${createInputHtml(["nickname"], "text", "publicID", { "class": `${DIALOG_INPUT_STYLE}` })}
		${createInputHtml(["password"], "password", "password", { "class": `${DIALOG_INPUT_STYLE}` })}
		${createInputHtml(["confirm_password"], "password", "confirmPassword", { "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${DIALOG_BTN_STYLE}` })}
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	${createButtonHtml(["sign_in"], `btn-sign-in`, { "class": `${DIALOG_BTN_STYLE}` })}
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	<p id="print-content"></p>
`;

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

export { SIGN_UP, signUpHandler };
