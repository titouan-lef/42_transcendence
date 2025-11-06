import { isOneStringEmtpy } from "../../utils/strings.js";
import { sendPostRequestToBack, sendGetRequestToBack } from "../api_request.js";
import { getSafeElement } from "../../utils/getSafeElement.js";

function connectUser(): void {

	const userId: HTMLInputElement = getSafeElement("login_user_id", HTMLInputElement);
	const userPassword: HTMLInputElement = getSafeElement("login_user_password", HTMLInputElement);
	const container: HTMLElement = getSafeElement("print-content", HTMLElement);

	if (isOneStringEmtpy(userId.value, userPassword.value)) {
		container.innerHTML = `<p>Form is incomplete.</p>`; /**@todo use translate tool */
		return;
	}

	const data = {
		id: userId.value,
		password: userPassword.value,
	};

	sendPostRequestToBack("api/user/login", JSON.stringify(data), "print-content");
}

function disconnectUser(): void {
	sendPostRequestToBack("api/user/logout", "{}", "print-content");
}

function whoami(): void {
	sendGetRequestToBack("api/user/whoami", "feedback_id");
}

export { connectUser, disconnectUser, whoami };
