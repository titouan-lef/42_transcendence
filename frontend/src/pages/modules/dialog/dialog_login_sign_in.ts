import { createButtonHtml } from "../../../components/button.js";
import { createInputHtml } from "../../../components/input.js";
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

export { SIGN_IN };
