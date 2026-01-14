import { isOneStringEmtpy } from "../../utils/strings.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { printReplyInDiv, sendPostRequestToBack } from "../api_request.js";
import { connectUser } from "./login.js";
import { Success } from '#shared/status_codes';
import { NewUserBody } from "#shared/HTTP.js";

async function newUser(): Promise<void> {

	const userId = getSafeElement("userID", HTMLInputElement);
	const userPseudo = getSafeElement("publicID", HTMLInputElement);
	const userPassword = getSafeElement("password", HTMLInputElement);
	const confPassword = getSafeElement("confirmPassword", HTMLInputElement);
	const container = getSafeElement("print-content", HTMLElement);
	if (!userId || !userPseudo || !userPassword || !confPassword || !container)
		return;

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
