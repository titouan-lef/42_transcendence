import { createButtonHtml } from "../../../components/button.js";
import { createInputHtml } from "../../../components/input.js";
import { isRequestSuccessfull, printReplyInDiv, sendPostRequestToBack } from "../../../services/api_request.js";
import { Errors } from "../../../services/status_codes.js";
import { getSafeElement } from "../../../utils/getSafeElement.js";
import { updateFriendList } from "../box/box_aside_friendlist.js";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_FORM_STYLE } from "./dialog_style.js";

/** @todo better front style for add friend */
const ADD_FRIEND = `
	<form name="Login" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["user_name"], "text", "find-friend", { "autofocus": "true", "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["add_friend"], `btn-add-friend`, { "class": `${DIALOG_BTN_STYLE}` })}
	<p id="print-content"></p>
`;

function addFriendHandler(modal: HTMLDialogElement): void {
	const addFriendElem = getSafeElement('btn-add-friend', HTMLElement);
	const newFriendElem = getSafeElement('find-friend', HTMLInputElement);

	addFriendElem.addEventListener('click', async () => {
		const reply = await sendPostRequestToBack('/api/friends/add', JSON.stringify({ user: newFriendElem.value }));
		if (reply.code === Errors.AUTH_REQUIRED) {
			/** @todo go to login page */
			return;
		} else if (!isRequestSuccessfull(reply)) {
			printReplyInDiv(reply, "print-content");
			return;
		}
		updateFriendList();
		modal.close();
	});
}

export { ADD_FRIEND, addFriendHandler };
