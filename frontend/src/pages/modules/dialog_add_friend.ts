import { createButtonHtml } from "../../components/button.js";
import { createInputHtml } from "../../components/input.js";
import { printReplyInDiv, sendPostRequestToBack } from "../../services/api_request.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { updateFriendList } from "./box_aside_friendlist.js";
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
		if (reply.status === 401) {
			/** @todo go to login page */
		} else if (reply.status !== 200) {
			printReplyInDiv(reply, "print-content");
			return;
		}
		updateFriendList();
		modal.close();
	});
}

export { ADD_FRIEND, addFriendHandler };
