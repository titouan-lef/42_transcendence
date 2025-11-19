import { createButtonHtml } from "../../components/button";
import { createInputHtml } from "../../components/input";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE } from "./dialog_style";

const SIGN_UP = `
	<form name="Register" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["user_name"], "text", "userID", { "autofocus": "true", "class": `${DIALOG_INPUT_STYLE}` })}
		${createInputHtml(["nick_name"], "text", "publicID", { "class": `${DIALOG_INPUT_STYLE}` })}
		${createInputHtml(["password"], "password", "password", { "class": `${DIALOG_INPUT_STYLE}` })}
		${createInputHtml(["confirm_password"], "password", "confirmPassword", { "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${DIALOG_BTN_STYLE}` })}
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	${createButtonHtml(["sign_in"], `btn-sign-in`, { "class": `${DIALOG_BTN_STYLE}` })}
`;

/** @wip changing event */
function signUpHandler(modal: HTMLDialogElement): void {
	// addHandler('btn-sign-up', 'click', () => connectUser(getSafeElement("userID", HTMLInputElement), getSafeElement("password", HTMLInputElement), getSafeElement("confirmPassword", HTMLInputElement), getSafeElement("publicID", HTMLInputElement))); /** @todo remove debug logs */
	// addHandler('btn-sign-in', 'click', () => loadDialog(signInHandler, SIGN_IN));
	// addHandler('modal', 'click', (e) => exitDialog('modal', modal, e));
}

export { SIGN_UP };
