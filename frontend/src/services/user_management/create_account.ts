import { isOneStringEmtpy } from "../../utils/strings.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { sendPostRequestToBack } from "../api_request.js";

function newUser(): void {

	const userId: HTMLInputElement = getSafeElement("create_user_id", HTMLInputElement);
	const userPseudo: HTMLInputElement = getSafeElement("create_user_pseudo", HTMLInputElement);
	const userPassword: HTMLInputElement = getSafeElement("create_user_password", HTMLInputElement);
	const confPassword: HTMLInputElement = getSafeElement("create_conf_password", HTMLInputElement);
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

	sendPostRequestToBack("api/user/new_user", JSON.stringify(data), "print-content");
}

export { newUser };
