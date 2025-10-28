import { isOneStringEmtpy } from "../../utils/strings.js";
import { getSafeElement, getSafeInput } from "../../utils/getSafeElement.js";
import { sendRequestToBack } from "../api_request.js";

function newUser(): void {

	const userId: HTMLInputElement = getSafeInput("create_user_id");
	const userPseudo: HTMLInputElement = getSafeInput("create_user_pseudo");
	const userPassword: HTMLInputElement = getSafeInput("create_user_password");
	const confPassword: HTMLInputElement = getSafeInput("create_conf_password");
	const container: HTMLElement = getSafeElement("print-content");

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

	sendRequestToBack("api/user/new_user", JSON.stringify(data), "print-content");
}

export { newUser };
