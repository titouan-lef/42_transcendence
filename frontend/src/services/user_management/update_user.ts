import { openDialogEmail } from "../../pages/modules/dialog/dialog.js";
import { showUserInfos } from "../../pages/modules/profile/profile_settings_user_infos.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { isRequestSuccessfull, printReplyInDiv, sendPostRequestToBack } from "../api_request.js";
import { Errors } from '#shared/status_codes';
import { getUserInfos } from "./login.js";

interface UserInfos {
	pseudo: string,
	password: string,
	email: string,
}

async function updateUser(): Promise<void> {
	const nick = getSafeElement('publicID', HTMLInputElement);
	const pass = getSafeElement('newPassword', HTMLInputElement);
	const confirmPass = getSafeElement('confirmPassword', HTMLInputElement);
	/** @todo make email empty possible! we can't erase our mail right now */
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
		pseudo: nick.value,
		password: pass.value,
		email: email.value,
	};

	const reply = await sendPostRequestToBack('/api/user/update_user', JSON.stringify(data));
	if (reply.code === Errors.TWOFA_REQUIRED) {
		openDialogEmail();
		return;
	}
	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, 'print-uinfo-reply');
		return;
	}

	await getUserInfos();
	showUserInfos();
}

export { updateUser };
