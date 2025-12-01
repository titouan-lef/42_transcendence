import { isOneStringEmtpy } from "../../utils/strings.js";
import { sendPostRequestToBack, sendGetRequestToBack, printReplyInDiv } from "../api_request.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { ASIDE_CONNECTED, ASIDE_NOT_CONNECTED, asideConnectedEvents, asideDisconnectedEvents, loadAside } from "../../pages/modules/box_aside.js";
import { generateFriendList } from "../../pages/modules/box_aside_friendlist.js";

async function connectUser(): Promise<void> {
	console.log('user is connected'); /** @todo update connect user */

	const modal = getSafeElement('modal', HTMLDialogElement);

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

	/** @todo change modal only in case of success */

	modal.close();

	/** @wip changing style here */

	loadAside(ASIDE_CONNECTED, asideConnectedEvents);

	/** @todo load friend list */

	generateFriendList();
}

async function disconnectUser(): Promise<void> {

	await sendGetRequestToBack("api/user/logout");

	/** @wip changing style here */
	loadAside(ASIDE_NOT_CONNECTED, asideDisconnectedEvents);
	const modal = getSafeElement('modal', HTMLDialogElement);

	modal.close();
}

async function whoami(): Promise<void> {
	const reply = await sendGetRequestToBack("api/user/whoami");
	printReplyInDiv(reply, "feedback_id");
}

export { connectUser, disconnectUser, whoami };
