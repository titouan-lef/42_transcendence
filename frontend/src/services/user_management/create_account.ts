import { isOneStringEmtpy } from "../../utils/strings.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { printReplyInDiv, sendPostRequestToBack } from "../api_request.js";
import { connectUser } from "./login.js";
import { Success } from '#shared/status_codes';
import { NewUserBody } from "#shared/HTTP.js";

async function newUser(): Promise<void> {

	const userId: HTMLInputElement = getSafeElement("userID", HTMLInputElement);
	const userPseudo: HTMLInputElement = getSafeElement("publicID", HTMLInputElement);
	const userPassword: HTMLInputElement = getSafeElement("password", HTMLInputElement);
	const confPassword: HTMLInputElement = getSafeElement("confirmPassword", HTMLInputElement);
	const container: HTMLElement = getSafeElement("print-content", HTMLElement);

	if (isOneStringEmtpy(userId.value, userPseudo.value, userPassword.value, confPassword.value)) {
		container.innerHTML = `<p>Form is incomplete.</p>`;
		return;
	}

	if (userPassword.value !== confPassword.value) {
		container.innerHTML = `<p>The password and confirm password differs</p>`;
		userPassword.value = "";
		confPassword.value = "";
		userPassword.focus();
		return;
	}

	const data: NewUserBody = {
		username: userId.value,
		nickname: userPseudo.value,
		password: userPassword.value
	};

	const reply = await sendPostRequestToBack("api/user/new_user", JSON.stringify(data));
	
	if (reply.code !== Success.USER_CREATED) {
		printReplyInDiv(reply, "print-content");
		return;
	}

	connectUser();
}

export { newUser };
