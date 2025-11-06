import { createButtonHtml } from "../components/button.js";
import { createInputHtml } from "../components/input.js";
import { addHandler } from "../routes/event.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { exitDialog } from "./dialog_utils.js";

const DIALOG_STYLE = `
flex flex-col justify-center items-center
`;

const BTN_STYLE = `
font-park font-bold
rounded-[10px]
text-[20px] text-primary
w-[150px] h-[40px]
`;

const SIGN_IN = `
<div class="${DIALOG_STYLE}">
	<form name="Login" class="flex flex-col">
		${createInputHtml(["user_name"], "text", "login_id", { "autofocus": "true" })}
		${createInputHtml(["password"], "password", "login_password")}
	</form>
	${createButtonHtml(["connect"], `btn-connect`, { "class": `${BTN_STYLE} bg-secondary` })}
	<hr>
	${createButtonHtml(["continue_as_guest"], `btn-guest`, { "class": `${BTN_STYLE} bg-secondary` })}
	${createButtonHtml(["create_account"], `btn-register`, { "class": `${BTN_STYLE} bg-secondary` })}
</div>
`;

function connectUser(): void {
	const userId: HTMLInputElement = getSafeElement("login_id", HTMLInputElement);
	const userPassword: HTMLInputElement = getSafeElement("login_password", HTMLInputElement);

	console.log(`connect button clicked with ${userId.value} and ${userPassword.value}`); /** @todo remove debug logs */
}

function signInHandler(modal: HTMLDialogElement): void {
	addHandler('btn-connect', 'click', () => connectUser());
	addHandler('btn-guest', 'click', () => console.log("guest button clicked.")); /** @todo remove debug logs */
	addHandler('btn-register', 'click', () => console.log("register button clicked.")); /** @todo remove debug logs */
	addHandler('modal', 'click', (e) => exitDialog('modal', modal, e));
}

export { SIGN_IN, signInHandler };
