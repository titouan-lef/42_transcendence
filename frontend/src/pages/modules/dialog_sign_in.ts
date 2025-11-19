import { createButtonHtml } from "../../components/button.js";
import { createInputHtml } from "../../components/input.js";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE } from "./dialog_style.js";

const SIGN_IN = `
	<form name="Login" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["user_name"], "text", "userID", { "autofocus": "true", "class": `${DIALOG_INPUT_STYLE}` })}
		${createInputHtml(["password"], "password", "password", { "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["sign_in"], `btn-sign-in`, { "class": `${DIALOG_BTN_STYLE}` })}
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	${createButtonHtml(["continue_as_guest"], `btn-guest`, { "class": `${DIALOG_BTN_STYLE}` })}
	${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${DIALOG_BTN_STYLE}` })}
`;

/**
 * @todo remove all handlers while switching dialogs ?
 * @wip changing events
*/
function signInHandler(modal: HTMLDialogElement): void {
	// clearHandlers();
	// addHandler('btn-sign-in', 'click', () => connectUser(getSafeElement("userID", HTMLInputElement), getSafeElement("password", HTMLInputElement)));
	// addHandler('btn-guest', 'click', () => console.log("guest button clicked.")); /** @todo remove debug logs */
	// addHandler('btn-sign-up', 'click', () => loadDialog(signUpHandler, SIGN_UP));
	// addHandler('modal', 'click', (e) => exitDialog('modal', modal, e));
}

export { SIGN_IN };
