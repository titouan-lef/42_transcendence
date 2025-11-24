import { isOneStringEmtpy } from "../../utils/strings.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { printReplyInDiv, sendPostRequestToBack } from "../api_request.js";
import { ASIDE_CONNECTED, asideConnectedEvents, loadAside } from "../../pages/modules/box_aside.js";
import { MODULAR, modularEvents } from "../../pages/modular.js";
import { loadPage } from "../../routes/page.js";
import { MAIN_BOX } from "../../pages/modules/box_main.js";

async function newUser(): Promise<void> {

	const userId: HTMLInputElement = getSafeElement("userID", HTMLInputElement);
	const userPseudo: HTMLInputElement = getSafeElement("publicID", HTMLInputElement);
	const userPassword: HTMLInputElement = getSafeElement("password", HTMLInputElement);
	const confPassword: HTMLInputElement = getSafeElement("confirmPassword", HTMLInputElement);
	const container: HTMLElement = getSafeElement("print-content", HTMLElement);

	if (isOneStringEmtpy(userId.value, userPseudo.value, userPassword.value, confPassword.value)) {
		container.innerHTML = `<p>Form is incomplete.</p>`; /**@todo use translate tool */
		return;
	}

	if (userPassword.value !== confPassword.value) {
		container.innerHTML = `<p>The password and confirm password differs</p>`; /**@todo use translate tool */
		userPassword.value = "";
		confPassword.value = "";
		userPassword.focus();
		return;
	}

	const data = {
		id: userId.value,
		pseudo: userPseudo.value,
		password: userPassword.value,
		ppLink: "/pictures/users/avatar.jpg" /** @TODO */
	};

	const reply = await sendPostRequestToBack("api/user/new_user", JSON.stringify(data));
	printReplyInDiv(reply, "print-content");

	/** @todo connect user if request succeed */

	const modal = getSafeElement('modal', HTMLDialogElement);

	modal.close();

	/** @wip changing style here */
	loadAside(ASIDE_CONNECTED, asideConnectedEvents);

}

export { newUser };
