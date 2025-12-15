import { Themes } from "../../assets/themes/theme.js";
import { isOneStringEmtpy } from "../../utils/strings.js";
import { sendPostRequestToBack, sendGetRequestToBack, printReplyInDiv, isRequestSuccessfull } from "../api_request.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { ASIDE_CONNECTED, asideConnectedEvents, loadAside } from "../../pages/modules/box/box_aside.js";
import { updateFriendList } from "../../pages/modules/box/box_aside_friendlist.js";
import { loadModularPage } from "../../pages/modular.js";
import { openDialog2FA } from "../../pages/modules/dialog/dialog.js";
import { Errors } from "../status_codes.js";

interface InfoList {
	username: string;
	pseudo: string;
	email: string | null;
	is2FAEnabled: boolean;
	isAvatarSet: boolean;
	theme: Themes | null
}

let user = "";
let currentUser: InfoList | null = null;

async function getUserInfos(): Promise<void> {
	const reply = await sendGetRequestToBack("/api/user/get_user");
	if (!isRequestSuccessfull(reply))
		return;

	const data: InfoList = JSON.parse(reply.content); /** @todo verify if try/ctach needed */
	currentUser = {
		username: data.username,
		pseudo: data.pseudo,
		email: data.email,
		is2FAEnabled: data.is2FAEnabled,
		isAvatarSet: data.isAvatarSet,
		theme: data.theme
	};
}

function clearUserInfos(): void {
	currentUser = null;
}

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
	if (reply.code === Errors.TWOFA_REQUIRED ) {
		openDialog2FA();
		return;
	}
	if (!isRequestSuccessfull(reply))
		return;

	const modal = getSafeElement('modal', HTMLDialogElement);
	modal.close();
	loadAside(ASIDE_CONNECTED, asideConnectedEvents);

	await getUserInfos();
	/** @todo add load main */
	/** @todo load user theme */
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
	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, "print-content");
		return;
	}

	const modal = getSafeElement('modal', HTMLDialogElement);
	/** @todo add load main */
	modal.close();
	loadAside(ASIDE_CONNECTED, asideConnectedEvents);
	await getUserInfos();
	updateFriendList();
}

async function disconnectUser(): Promise<void> {
	await sendGetRequestToBack("/api/user/logout");
	clearUserInfos();
	loadModularPage();
}

export { currentUser, getUserInfos, connectUser, disconnectUser, sendSecureCode };
