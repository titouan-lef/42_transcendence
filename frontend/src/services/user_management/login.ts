import { isOneStringEmtpy } from "../../utils/strings.js";
import { sendPostRequestToBack, printReplyInDiv, isRequestSuccessfull } from "../api_request.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { Errors } from '#shared/status_codes';
import { getUserInfos } from "./user_state.js";
import { loadDialog2FA } from "../../pages/modules/dialog/dialog_2FA.js";
import { navigateTo } from "../../routes/navigate.js";
import { Pages } from "../../routes/navigate_types.js";
import { NewUserBody } from "#shared/HTTP.js";

let user = "";

async function connectUser(): Promise<void> {
	const userId = getSafeElement("userID", HTMLInputElement);
	const userPassword = getSafeElement("password", HTMLInputElement);
	const container = getSafeElement("print-content", HTMLElement);
	if (!userId || !userPassword || !container)
		return;

	if (isOneStringEmtpy(userId.value, userPassword.value)) {
		container.innerHTML = `<p>Form is incomplete.</p>`;
		return;
	}

	const data: NewUserBody = {
		username: userId.value,
		nickname: '', //  will not be used
		password: userPassword.value,
	};

	const reply = await sendPostRequestToBack("api/user/login", JSON.stringify(data));

	user = userId.value;
	if (reply.code === Errors.TWOFA_REQUIRED ) {
		loadDialog2FA(user);
		return;
	}
	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, "print-content");
		return;
	}
	navigateTo(Pages.HOME);
}

export { getUserInfos, connectUser };
