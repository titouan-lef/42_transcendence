import { getModeForUsageLocation } from "typescript";
import { createButtonHtml } from "../components/button.js";
import { createInputHtml } from "../components/input.js";
import { addHandler } from "../routes/event.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { loadDialog, exitDialog } from "./dialog_utils.js";
import { ASIDE_CONNECTED, COLOR_ALT, COLOR_BASE, MAIN_STYLE, PLAY_BTN_STYLE } from "./main_menu.js";

const BTN_STYLE = `
rounded-xl p-[5px] w-full
text-primary align-center text-center font-bold
bg-secondary
`;

const INPUT_STYLE = `
rounded-xl p-[5px] min-w-[100px] max-w-[250px]
text-tx-sec align-center text-center font-bold
bg-lighter
focus:outline-2 focus:text-dark
`;

const SIGN_IN = `
<div class="bg-primary rounded-2xl h-full flex justify-center m-auto p-6 w-full">
	<div class="flex flex-col justify-center items-center gap-4 min-w-[100px] max-w-[250px]">
		<form name="Login" class="flex flex-col justify-center items-center gap-3">
			${createInputHtml(["user_name"], "text", "userID", { "autofocus": "true", "class": `${INPUT_STYLE}` })}
			${createInputHtml(["password"], "password", "password", { "class": `${INPUT_STYLE}` })}
		</form>
		${createButtonHtml(["sign_in"], `btn-sign-in`, { "class": `${BTN_STYLE}` })}
		<hr class="border-2 rounded-2xl border-dark w-1/2">
		${createButtonHtml(["continue_as_guest"], `btn-guest`, { "class": `${BTN_STYLE}` })}
		${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${BTN_STYLE}` })}
	</div>
</div>
`;

const SIGN_UP = `
<div class="bg-primary rounded-2xl h-full flex justify-center m-auto p-6 w-full">
	<div class="flex flex-col justify-center items-center gap-4 min-w-[100px] max-w-[250px]">
		<form name="Register" class="flex flex-col justify-center items-center gap-3">
			${createInputHtml(["user_name"], "text", "userID", { "autofocus": "true", "class": `${INPUT_STYLE}` })}
			${createInputHtml(["nick_name"], "text", "publicID", { "class": `${INPUT_STYLE}` })}
			${createInputHtml(["password"], "password", "password", { "class": `${INPUT_STYLE}` })}
			${createInputHtml(["confirm_password"], "password", "confirmPassword", { "class": `${INPUT_STYLE}` })}
		</form>
		${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${BTN_STYLE}` })}
		<hr class="border-2 rounded-2xl border-dark w-1/2">
		${createButtonHtml(["sign_in"], `btn-sign-in`, { "class": `${BTN_STYLE}` })}
	</div>
</div>
`;

function connectUser(userID: HTMLInputElement, password: HTMLInputElement, confirmPassword?: HTMLInputElement, publicID?: HTMLInputElement): void {

	if (confirmPassword && publicID) {
		if (password.value !== confirmPassword.value) {
			console.log(`passwords not matching`); /** @todo remove debug logs */
			return ;
		} else {
			console.log(`sign-up button clicked with ${userID.value} and ${password.value}, public nick name is ${publicID.value}`); /** @todo remove debug logs */
		}
	} else {
		console.log(`sign-in button clicked with ${userID.value} and ${password.value}`); /** @todo remove debug logs */
	}

	const modal = getSafeElement('modal', HTMLDialogElement);
	const asideElem = getSafeElement('aside', HTMLElement);
	const mainElem = getSafeElement('main', HTMLElement);
	const mainPlayButtonElem = getSafeElement('main-play-btn', HTMLInputElement);

	modal.close();
	asideElem.innerHTML = ASIDE_CONNECTED;
	mainElem.className = `${MAIN_STYLE} ${COLOR_ALT}`;
	mainPlayButtonElem.className = `${PLAY_BTN_STYLE} ${COLOR_BASE}`;
	// mainelem.attributeStyleMap.set("bg-color", "bg-secondary");
	addHandler("btn-profile", "click", () => loadDialog(signInHandler, SIGN_IN));
	addHandler("add-friend", "click", () => console.log("adding friend..."));
}

/** @todo remove all handlers while switching dialogs ? */
function signInHandler(modal: HTMLDialogElement): void {
	addHandler('btn-sign-in', 'click', () => connectUser(getSafeElement("userID", HTMLInputElement), getSafeElement("password", HTMLInputElement)));
	addHandler('btn-guest', 'click', () => console.log("guest button clicked.")); /** @todo remove debug logs */
	addHandler('btn-sign-up', 'click', () => loadDialog(signUpHandler, SIGN_UP));
	addHandler('modal', 'click', (e) => exitDialog('modal', modal, e));
}

/** @todo remove all handlers while switching dialogs ? */
function signUpHandler(modal: HTMLDialogElement): void {
	addHandler('btn-sign-up', 'click', () => connectUser(getSafeElement("userID", HTMLInputElement), getSafeElement("password", HTMLInputElement), getSafeElement("confirmPassword", HTMLInputElement), getSafeElement("publicID", HTMLInputElement))); /** @todo remove debug logs */
	addHandler('btn-sign-in', 'click', () => loadDialog(signInHandler, SIGN_IN));
	addHandler('modal', 'click', (e) => exitDialog('modal', modal, e));
}

export { SIGN_IN, loadDialog, signInHandler };
export { SIGN_UP, signUpHandler };
