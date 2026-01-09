import { createButtonHtml } from "../../../components/button.js";
import { createInputHtml } from "../../../components/input.js";
import { isRequestSuccessfull, printReplyInDiv, sendPostRequestToBack } from "../../../services/api_request.js";
import { Errors } from '#shared/status_codes';
import { getSafeElement } from "../../../utils/getSafeElement.js";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_FORM_STYLE } from "./dialog_style.js";
import { loadDialog } from "./dialog.js";
import { goBack, navigateTo } from "../../../routes/navigate.js";
import { Modals } from "../../../routes/navigate_types.js";
import { UserBody } from "#shared/HTTP.js";
import { updateFriendList } from "../box/box_aside_friendlist.js";

/** @todo better print-content */
const ADD_FRIEND = `
	<p class='text-[18px] font-bold'>find your friend</p>
	<form name="Login" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["user_name"], "text", "find-friend", { "autofocus": "true", "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["add_friend"], `btn-add-friend`, { "class": `${DIALOG_BTN_STYLE}` })}
	<p id="print-content"></p>
`;

async function addFriend(user: string): Promise<boolean> {
	const body: UserBody = { user: user };
	const reply = await sendPostRequestToBack('/api/friends/add', JSON.stringify(body));
	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, "print-content");
		return false;
	}
	return true;
}

function addFriendHandler(modal: HTMLDialogElement): void {
	const addFriendElem = getSafeElement('btn-add-friend', HTMLElement);
	const newFriendElem = getSafeElement('find-friend', HTMLInputElement);

	addFriendElem.addEventListener('click', async () => {
		const result = addFriend(newFriendElem.value);
		if (!result)
			return;
		goBack();
		updateFriendList();
	});
}

function openDialogAddFriend(): void {
	loadDialog(ADD_FRIEND, addFriendHandler);
}

function loadDialogAddFriend(): void {
	navigateTo(Modals.ADD_FRIEND);
}

export { loadDialogAddFriend, openDialogAddFriend, addFriend };
