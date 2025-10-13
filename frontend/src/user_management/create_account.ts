import {getInput} from "../interface_interation.js";
import {sendRequestToBack} from "../api_request.js";

export function newUser(): void {

	const userId: HTMLInputElement | null = getInput("create_user_id");
	const userPseudo: HTMLInputElement | null = getInput("create_user_pseudo");
	const userPassword: HTMLInputElement | null = getInput("create_user_password");
	const confPassword: HTMLInputElement | null = getInput("create_conf_password");
	const container: HTMLElement | null = document.getElementById("print-content");

	if (!userId || !userPseudo || !userPassword || !confPassword) {
		console.error("User creation form is incomplete");
		return;
	}

	if (!userId.value || !userPseudo.value || !userPassword.value || !confPassword.value) {
		if (container)
			container.innerHTML = `<p>Form is incomplete.</p>`;
		return;
	}

	if (userPassword.value !== confPassword.value && container) {
		container.innerHTML = `<p>The password and confirm password differs</p>`;
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