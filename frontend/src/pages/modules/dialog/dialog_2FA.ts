import { goBack, navigateTo } from "../../../routes/navigate";
import { createButtonHtml } from "../../../components/button";
import { createInputHtml } from "../../../components/input";
import { loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_SEPARATOR_STYLE, DIALOG_FORM_STYLE } from "./dialog_style";
import { Modals } from "../../../routes/navigate_types";
import { getSafeElement } from "../../../utils/getSafeElement";
import { isRequestSuccessfull, printReplyInDiv, ReplyFromBack, sendPostRequestToBack } from "../../../services/api_request";
import { getCurrentUserInfos } from "../../../services/user_management/user_state";
import { Content2FA } from "#shared/HTTP";

const PRINT_CONTENT_STYLE = `
w-full h-[20px] text-[12px] text-warning text-center
`;

/** @todo use TRANSLATOR */
const TWOFA = `
	<p class='font-bold text-[20px]'> 2FA required </p>
	<form name="Register" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["code"], "password", "password", { "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["confirm"], `btn-confirm`, { "class": `${DIALOG_BTN_STYLE}` })}
	${createButtonHtml(["cancel"], `btn-cancel`, { "class": `${DIALOG_BTN_STYLE}` })}
	<p class='${PRINT_CONTENT_STYLE}' id="print-content"></p>
`;

/** @todo better solution than having another dialog */
const EMAIL_CONFIRMATION = `
	<p class='font-bold text-[20px]'> 2FA required </p>
	<form name="Register" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["password"], "password", "password", { "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["refify_email"], `btn-verify-email`, { "class": `${DIALOG_BTN_STYLE}` })}
	${createButtonHtml(["cancel"], `btn-cancel`, { "class": `${DIALOG_BTN_STYLE}` })}
	<p class='${PRINT_CONTENT_STYLE}' id="print-content"></p>
`;

let username = '';

async function sendSecureCode(): Promise<boolean> {
	const code = getSafeElement('password', HTMLInputElement).value;
	const container: HTMLElement = getSafeElement("print-content", HTMLElement);
	if (!code) {
		container.innerHTML = `Please enter a 4 digit code.`; /**@todo use translate tool */
		return false;
	}
	let body : Content2FA;
	const currentUser = getCurrentUserInfos();
	if (currentUser)
		body = { user: currentUser.username, code: Number(code) };
	else
		body = { user: username, code: Number(code) };
	const reply = await sendPostRequestToBack("/api/user/secure", JSON.stringify(body));

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
			case 'btn-cancel':
				elem.addEventListener('click', goBack);
				break;
			case 'btn-confirm':
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
