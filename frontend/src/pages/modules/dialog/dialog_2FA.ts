import { goBack, navigateTo } from "../../../routes/navigate";
import { createButtonHtml } from "../../../components/button";
import { createInputHtml } from "../../../components/input";
import { loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE } from "./dialog_style";
import { Modals } from "../../../routes/navigate_types";
import { getSafeElement } from "../../../utils/getSafeElement";
import { isRequestSuccessfull, printReplyInDiv, ReplyFromBack, sendPostRequestToBack } from "../../../services/api_request";
import { getCurrentUserInfos } from "../../../services/user_management/user_state";

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

let username = '';

async function sendSecureCode(): Promise<boolean> {
	const code = getSafeElement('password', HTMLInputElement).value;
	const container: HTMLElement = getSafeElement("print-content", HTMLElement);
	if (!code) {
		container.innerHTML = `<p>Please enter a 4 digit code.</p>`; /**@todo use translate tool */
		return false;
	}
	let reply: ReplyFromBack;
	const currentUser = getCurrentUserInfos();
	if (currentUser)
		reply = await sendPostRequestToBack("/api/user/secure", JSON.stringify({ user: currentUser.username, code: code }));
	else
		reply = await sendPostRequestToBack("/api/user/secure", JSON.stringify({ user: username, code: code }));

	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, "print-content");
		return false;
	}
	return true;
}

async function verify2FA(): Promise<void> {
	if(!await sendSecureCode())
		return;
	goBack();
}

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

function loadDialog2FA(user: string): void {
	username = user;
	navigateTo(Modals.TWO_FA);
}

function loadDialogEmail(): void {
	navigateTo(Modals.EMAIL_CONF);
}

export { loadDialog2FA, loadDialogEmail, openDialog2FA, openDialogEmail };
