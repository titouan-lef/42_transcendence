import { getInput, isOneStringEmtpy } from "../interface_interation.js";
import { sendRequestToBack } from "../api_request.js";

function newUser(): void {

	const userId: HTMLInputElement | null = getInput("create_user_id");
	const userPseudo: HTMLInputElement | null = getInput("create_user_pseudo");
	const userPassword: HTMLInputElement | null = getInput("create_user_password");
	const confPassword: HTMLInputElement | null = getInput("create_conf_password");
	const container: HTMLElement | null = document.getElementById("print-content");

	if (!userId || !userPseudo || !userPassword || !confPassword) { // will no longer exist after merger with new front
		console.error("User creation form is incomplete");
		return;
	}

	if (isOneStringEmtpy(userId.value, userPseudo.value, userPassword.value, confPassword.value)) {
		if (container) // will no longer exist after merger with new front
			container.innerHTML = `<p>Form is incomplete.</p>`; /**@todo use translate tool */
		return;
	}

	if (userPassword.value !== confPassword.value && container) { //the container check will no longer exist after merger with new front
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