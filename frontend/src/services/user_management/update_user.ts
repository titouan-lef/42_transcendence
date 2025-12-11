import { showProfile } from "../../pages/modules/profile_settings.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { isRequestSuccessfull, printReplyInDiv, sendGetRequestToBack, sendPostRequestToBack } from "../api_request.js";

interface UserInfos {
	nick: string,
	pass: string,
	email: string,
}

async function updateUser(): Promise<void> {

	const nick = getSafeElement('publicID', HTMLInputElement);
	const pass = getSafeElement('newPassword', HTMLInputElement);
	const confirmPass = getSafeElement('confirmPassword', HTMLInputElement);
	const email = getSafeElement('user-email', HTMLInputElement);

	const container = getSafeElement('print-uinfo-reply', HTMLElement);

	if (pass.value && pass.value !== confirmPass.value) {
		container.innerHTML = `<p>The password and confirm password differs</p>`; /**@todo use translate tool */
		pass.value = "";
		confirmPass.value = "";
		pass.focus();
		return;
	}
	const data: UserInfos = {
		nick: nick.value,
		pass: pass.value,
		email: email.value
	};

	const reply = await sendPostRequestToBack('/api/user/update_user', JSON.stringify(data));
	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, 'print-uinfo-reply');
		return;
	}

	showProfile();
}

export { updateUser };
