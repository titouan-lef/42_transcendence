import { isOneStringEmtpy } from "../../utils/strings.js";
import { sendPostRequestToBack, printReplyInDiv, isRequestSuccessfull, ReplyFromBack } from "../api_request.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { updateFriendList } from "../../pages/modules/box/box_aside_friendlist.js";
import { loadModularPage } from "../../pages/modular.js";
import { openProfile } from "../../pages/modules/profile/profile.js";
import { Errors } from '#shared/status_codes';
import { getCurrentUserInfos, getUserInfos } from "./user_state.js";
import { openDialog2FA } from "../../pages/modules/dialog/dialog_2FA.js";
import { loadSettings } from "../../pages/modules/profile/profile_settings.js";

let user = "";

async function connectUser(): Promise<void> {
	const userId: HTMLInputElement = getSafeElement("userID", HTMLInputElement);
	const userPassword: HTMLInputElement = getSafeElement("password", HTMLInputElement);
	const container: HTMLElement = getSafeElement("print-content", HTMLElement);

	if (isOneStringEmtpy(userId.value, userPassword.value)) {
		container.innerHTML = `<p>Form is incomplete.</p>`; /**@todo use translate tool */
		return;
	}

	const data = {
		user: userId.value,
		password: userPassword.value,
	};

	const reply = await sendPostRequestToBack("api/user/login", JSON.stringify(data));

	user = userId.value;
	if (reply.code === Errors.TWOFA_REQUIRED ) {
		openDialog2FA();
		return;
	}
	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, "print-content");
		return;
	}

	const modal = getSafeElement('modal', HTMLDialogElement);
	modal.close();
	await getUserInfos();
	loadModularPage();
	updateFriendList();
}

async function sendSecureCode(): Promise<boolean> {
	const code = getSafeElement('password', HTMLInputElement).value;
	const container: HTMLElement = getSafeElement("print-content", HTMLElement);
	if (!code) {
		container.innerHTML = `<p>Please enter a 4 digit code.</p>`; /**@todo use translate tool */
		return false;
	}
	let reply: ReplyFromBack;
	const currentUser = getCurrentUserInfos();
	if (currentUser)
		reply = await sendPostRequestToBack("/api/user/secure", JSON.stringify({ user: currentUser.username, code: code }));
	else
		reply = await sendPostRequestToBack("/api/user/secure", JSON.stringify({ user: user, code: code }));

	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, "print-content");
		return false;
	}
	const modal = getSafeElement('modal', HTMLDialogElement);
	modal.close();
	return true;
}

async function verify2FAConnection(): Promise<void> {
	if(!await sendSecureCode())
		return;
	await getUserInfos();
	loadModularPage();
	updateFriendList();
}

async function verify2FAConfirmation(): Promise<void> {
	if(!await sendSecureCode())
		return;
	await getUserInfos();
	openProfile(); // go back to settings
	loadSettings();
}

export { getUserInfos, connectUser, verify2FAConnection, verify2FAConfirmation };
