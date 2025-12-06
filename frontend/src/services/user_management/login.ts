import { isOneStringEmtpy } from "../../utils/strings.js";
import { sendPostRequestToBack, sendGetRequestToBack, printReplyInDiv } from "../api_request.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { ASIDE_CONNECTED, ASIDE_NOT_CONNECTED, asideConnectedEvents, asideDisconnectedEvents, loadAside } from "../../pages/modules/box_aside.js";
import { updateFriendList } from "../../pages/modules/box_aside_friendlist.js";
import { loadModularPage } from "../../pages/modular.js";
import { openDialog2FA } from "../../pages/modules/dialog.js";

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
	printReplyInDiv(reply, "print-content");

	user = userId.value;
	if (reply.status === 401) {
		openDialog2FA();
		return;
	}
	if (reply.status !== 200)
		return;

	const modal = getSafeElement('modal', HTMLDialogElement);
	modal.close();
	loadAside(ASIDE_CONNECTED, asideConnectedEvents);
	updateFriendList();
}

async function sendSecureCode(): Promise<void> {
	const code = getSafeElement('password', HTMLInputElement).value;
	const container: HTMLElement = getSafeElement("print-content", HTMLElement);
	if (!code) {
		container.innerHTML = `<p>Please enter a 4 digit code.</p>`; /**@todo use translate tool */
		return;
	}
	const reply = await sendPostRequestToBack("/api/user/secure", JSON.stringify({ user: user, code: code }));
	printReplyInDiv(reply, "print-content");
	if (reply.status !== 200)
		return;

	const modal = getSafeElement('modal', HTMLDialogElement);
	modal.close();
	loadAside(ASIDE_CONNECTED, asideConnectedEvents);
	updateFriendList();
}

async function disconnectUser(): Promise<void> {
	await sendGetRequestToBack("/api/user/logout");
	loadModularPage();
}

export { connectUser, disconnectUser, sendSecureCode };
