import { isOneStringEmtpy } from "../../utils/strings.js";
import { sendRequestToBack } from "../api_request.js";
import { getSafeElement, getSafeInput } from "../../utils/getSafeElement.js";

function connectUser(): void {

	const userId: HTMLInputElement = getSafeInput("login_user_id");
	const userPassword: HTMLInputElement = getSafeInput("login_user_password");
	const container: HTMLElement = getSafeElement("print-content");

	if (isOneStringEmtpy(userId.value, userPassword.value)) {
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
