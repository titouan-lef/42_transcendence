import { createButtonHtml } from "../components/button.js";
import { createInputHtml } from "../components/input.js";
import { addHandler } from "../routes/event.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { exitDialog } from "./dialog_utils.js";

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
			${createInputHtml(["user_name"], "text", "login_id", { "autofocus": "true", "class": `${INPUT_STYLE}` })}
			${createInputHtml(["password"], "password", "login_password", { "class": `${INPUT_STYLE}` })}
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
		<form name="Login" class="flex flex-col justify-center items-center gap-3">
			${createInputHtml(["user_name"], "text", "login_id", { "autofocus": "true", "class": `${INPUT_STYLE}` })}
			${createInputHtml(["nick_name"], "text", "login_nick", { "class": `${INPUT_STYLE}` })}
			${createInputHtml(["password"], "password", "login_password", { "class": `${INPUT_STYLE}` })}
			${createInputHtml(["confirm_password"], "password", "login_confirm_password", { "class": `${INPUT_STYLE}` })}
		</form>
		${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${BTN_STYLE}` })}
		<hr class="border-2 rounded-2xl border-dark w-1/2">
		${createButtonHtml(["go_back"], `btn-guest`, { "class": `${BTN_STYLE}` })}
	</div>
</div>
`;

function connectUser(): void {
	const userId: HTMLInputElement = getSafeElement("login_id", HTMLInputElement);
	const userPassword: HTMLInputElement = getSafeElement("login_password", HTMLInputElement);

	console.log(`sign-in button clicked with ${userId.value} and ${userPassword.value}`); /** @todo remove debug logs */
}

function loadSignUp(): void {
	const elem = getSafeElement('modal', HTMLDialogElement);

	elem.innerHTML = SIGN_UP;
}

function signInHandler(modal: HTMLDialogElement): void {
	addHandler('btn-sign-in', 'click', () => connectUser());
	addHandler('btn-guest', 'click', () => console.log("guest button clicked.")); /** @todo remove debug logs */
	addHandler('btn-sign-up', 'click', () => loadSignUp()); /** @todo remove debug logs */
	addHandler('modal', 'click', (e) => exitDialog('modal', modal, e));
}

export { SIGN_IN, signInHandler };
