import { createButtonHtml } from "../../../components/button";
import { createInputHtml } from "../../../components/input";
import { sendSecureCode } from "../../../services/user_management/login";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE } from "./dialog_style";

/** @todo make print-content great. again? */
/** @todo change `password` into `verification code` */
/** @todo change `sign_up` into `send code` ot `confrim` */
/** @todo resend button ? backward button ? */
const TWOFA = `
	<p> 2FA required </p>
	<form name="Register" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["password"], "password", "password", { "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${DIALOG_BTN_STYLE}` })}
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	<p id="print-content"></p>
`;

function twoFAHandler(modal: HTMLDialogElement): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-sign-up':
				elem.addEventListener('click', sendSecureCode);
				break;
			default:
				break;
		}
	});
}

export { TWOFA, twoFAHandler };
