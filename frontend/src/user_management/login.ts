import { getInput, isOneStringEmtpy } from "../interface_interation.js";
import { sendRequestToBack } from "../api_request.js";

function connectUser(): void {

	const userId: HTMLInputElement | null = getInput("login_user_id");
	const userPassword: HTMLInputElement | null = getInput("login_user_password");
	const container: HTMLElement | null = document.getElementById("print-content");

	if (!userId || !userPassword) {
		console.error("Login form is incomplete"); /**@todo use translate tool */
		return;
	}

	if (isOneStringEmtpy(userId.value, userPassword.value)) {
		if (container) // will no longer exist after merger with new front
			container.innerHTML = `<p>Form is incomplete.</p>`; /**@todo use translate tool */
		return;
	}

	const data = {
		id: userId.value,
		password: userPassword.value,
	};

	sendRequestToBack("api/user/login", JSON.stringify(data), "print-content");
}

function disconnectUser(): void {
	sendRequestToBack("api/user/logout", "{}", "print-content");
}

function whoami(): void {
	sendRequestToBack("api/user/whoami", "{}", "feedback_id");
}

export { connectUser, disconnectUser, whoami };
