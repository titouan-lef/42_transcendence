import { isOneStringEmtpy } from "../../utils/strings.js";
import { sendPostRequestToBack, sendGetRequestToBack, printReplyInDiv } from "../api_request.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { ASIDE_CONNECTED, ASIDE_NOT_CONNECTED, asideConnectedEvents, asideDisconnectedEvents, loadAside } from "../../pages/modules/box_aside.js";
import { updateFriendList } from "../../pages/modules/box_aside_friendlist.js";
import { loadModularPage } from "../../pages/modular.js";

async function connectUser(): Promise<void> {
	const userId: HTMLInputElement = getSafeElement("userID", HTMLInputElement);
	const userPassword: HTMLInputElement = getSafeElement("password", HTMLInputElement);
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

	if (reply.status !== 200)
		return;

	const modal = getSafeElement('modal', HTMLDialogElement);
 
	modal.close();

	loadAside(ASIDE_CONNECTED, asideConnectedEvents);

	/** @todo load friend list */

	updateFriendList();
}

async function disconnectUser(): Promise<void> {
	await sendGetRequestToBack("/api/user/logout");
	loadModularPage();
}

export { connectUser, disconnectUser };
