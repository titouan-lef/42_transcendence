import { navigateTo } from "src/routes/navigate";
import { createButtonHtml } from "../../../components/button";
import { createInputHtml } from "../../../components/input";
import { verify2FA } from "../../../services/user_management/login";
import { loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE } from "./dialog_style";
import { Modals } from "src/routes/navigate_types";

/** @todo make print-content great. again? */
/** @todo change `password` into `verification code` */
/** @todo change `sign_up` into `send code` ot `confrim` */
/** @todo use TRANSLATOR */
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

/** @todo better solution than having another dialog */
const EMAIL_CONFIRMATION = `
	<p> 2FA required </p>
	<form name="Register" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["password"], "password", "password", { "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["refify_email"], `btn-verify-email`, { "class": `${DIALOG_BTN_STYLE}` })}
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	<p id="print-content"></p>
`;

function twoFAHandler(modal: HTMLDialogElement): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			/** @todo add cancel button, resend button */
			case 'btn-sign-up':
				elem.addEventListener('click', verify2FA);
				break;
			case 'btn-verify-email':
				elem.addEventListener('click', verify2FA);
				break;
			default:
				break;
		}
	});
}

function openDialog2FA(): void {
	loadDialog(TWOFA, twoFAHandler);
}

function openDialogEmail(): void {
	loadDialog(EMAIL_CONFIRMATION, twoFAHandler);
}

function loadDialog2FA(): void {
	navigateTo(Modals.TWO_FA);
}

function loadDialogEmail(): void {
	navigateTo(Modals.EMAIL_CONF);
}

export { loadDialog2FA, loadDialogEmail, openDialog2FA, openDialogEmail };
