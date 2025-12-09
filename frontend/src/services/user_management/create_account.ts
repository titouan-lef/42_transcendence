import { isOneStringEmtpy } from "../../utils/strings.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { printReplyInDiv, sendPostRequestToBack } from "../api_request.js";
import { connectUser } from "./login.js";

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
		username: userId.value,
		pseudo: userPseudo.value,
		password: userPassword.value,
		ppLink: "/pictures/users/avatar.jpg" /** @TODO */
	};

	const reply = await sendPostRequestToBack("api/user/new_user", JSON.stringify(data));
	printReplyInDiv(reply, "print-content");

	if (reply.status !== 201)
		return;

	connectUser();

	/** @todo set user theme to currentTheme ? */

}

export { newUser };
