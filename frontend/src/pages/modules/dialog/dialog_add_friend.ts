import { createButtonHtml } from "../../../components/button.js";
import { createInputHtml } from "../../../components/input.js";
import { isRequestSuccessfull, printReplyInDiv, sendPostRequestToBack } from "../../../services/api_request.js";
import { getSafeElement } from "../../../utils/getSafeElement.js";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_FORM_STYLE } from "./dialog_style.js";
import { loadDialog } from "./dialog.js";
import { goBack, navigateTo } from "../../../routes/navigate.js";
import { Modals } from "../../../routes/navigate_types.js";
import { UserBody } from "#shared/HTTP.js";
import { updateFriendList } from "../box/box_aside_friendlist.js";
import { isValidName } from "#shared/verifications.js";
import { translate } from "../../../lang/lang.js";
import { getCurrentUserInfos } from "../../../services/user_management/user_state.js";

const PRINT_CONTENT_STYLE = `
w-full h-[20px] text-[12px] text-warning text-center
`;

const ADD_FRIEND = `
	<p class='text-[18px] font-bold'>find your friend</p>
	<form name="Login" class="${DIALOG_FORM_STYLE}" onsubmit='return false;'>
		${createInputHtml(["user_name"], "text", "find-friend", { "autofocus": "true", "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["add_friend"], `btn-add-friend`, { "class": `${DIALOG_BTN_STYLE}` })}
	<p id="print-content" class='${PRINT_CONTENT_STYLE}'></p>
`;

async function addSecureFriend(user: string): Promise<boolean> {
	const elem = getSafeElement('print-content', HTMLElement);
	if (!elem)
		return false;
	if (!isValidName(user)) {
		elem.innerHTML = translate("invalid_username");
		return false;
	}
	if (user === getCurrentUserInfos()?.username) {
		elem.innerHTML = translate("friend_himself");
		return false;
	}

	return await addFriend(user);
}

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
	if (!addFriendElem || !newFriendElem)
		return;

	addFriendElem.addEventListener('click', async () => {
		const result = await addSecureFriend(newFriendElem.value);
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
