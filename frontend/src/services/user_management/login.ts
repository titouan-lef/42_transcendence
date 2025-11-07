import { isOneStringEmtpy } from "../../utils/strings.js";
import { sendPostRequestToBack, sendGetRequestToBack, printReplyInDiv } from "../api_request.js";
import { getSafeElement } from "../../utils/getSafeElement.js";

async function connectUser(): Promise<void> {

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

	const reply = await sendPostRequestToBack("api/user/login", JSON.stringify(data));
	printReplyInDiv(reply, "print-content");
	
}

async function disconnectUser(): Promise<void> {
	const reply = await sendGetRequestToBack("api/user/logout");
	printReplyInDiv(reply, "print-content");
	
}

async function whoami(): Promise<void> {
	const reply = await sendGetRequestToBack("api/user/whoami");
	printReplyInDiv(reply, "feedback_id");
}

export { connectUser, disconnectUser, whoami };
