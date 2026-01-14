import { isOneStringEmtpy } from "../../utils/strings.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { printReplyInDiv, sendPostRequestToBack } from "../api_request.js";
import { connectUser } from "./login.js";
import { Success } from '#shared/status_codes';
import { NewUserBody } from "#shared/HTTP.js";
import { isValidName, isValidPassword } from "#shared/verifications.js";
import { translate } from "src/lang/lang.js";

async function newUser(): Promise<void> {

	const userId = getSafeElement("userID", HTMLInputElement);
	const userNickname = getSafeElement("publicID", HTMLInputElement);
	const userPassword = getSafeElement("password", HTMLInputElement);
	const confPassword = getSafeElement("confirmPassword", HTMLInputElement);
	const container = getSafeElement("print-content", HTMLElement);
	if (!userId || !userNickname || !userPassword || !confPassword || !container)
		return;

	if (isOneStringEmtpy(userId.value, userNickname.value, userPassword.value, confPassword.value)) {
		container.innerHTML = translate("incomplete_form");
		return;
	}
	if (!isValidName(userId.value)) {
		container.innerHTML = translate("invalid_username");
		return;
	}
	if (!isValidName(userNickname.value)) {
		container.innerHTML = translate("invalid_nickname");
		return;
	}
	if (!isValidPassword(userPassword.value)) {
		container.innerHTML = translate("invalid_password");
		userPassword.value = "";
		confPassword.value = "";
		userPassword.focus();
		return;
	}

	if (userPassword.value !== confPassword.value) {
		container.innerHTML = translate("diff_password");
		userPassword.value = "";
		confPassword.value = "";
		userPassword.focus();
		return;
	}

	const data: NewUserBody = {
		username: userId.value,
		nickname: userNickname.value,
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
