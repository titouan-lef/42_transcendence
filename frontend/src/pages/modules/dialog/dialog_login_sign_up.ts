import { createButtonHtml } from "../../../components/button";
import { createInputHtml } from "../../../components/input";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE } from "./dialog_style";

const PRINT_CONTENT_STYLE = `
w-full h-[20px] text-[12px] text-warning text-center
`;

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
	<p id="print-content" class='${PRINT_CONTENT_STYLE}'></p>
`;

export { SIGN_UP };
