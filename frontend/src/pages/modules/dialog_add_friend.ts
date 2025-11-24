import { createButtonHtml } from "../../components/button.js";
import { createInputHtml } from "../../components/input.js";
import { getSafeElement } from "../../utils/getSafeElement.js";
import { FRIENDLIST, generateFriendList } from "./box_aside_friendlist.js";
import { DIALOG_BTN_STYLE, DIALOG_INPUT_STYLE, DIALOG_FORM_STYLE } from "./dialog_style.js";

/** @todo better front style for add friend */
const ADD_FRIEND = `
	<form name="Login" class="${DIALOG_FORM_STYLE}">
		${createInputHtml(["user_name"], "text", "find-friend", { "autofocus": "true", "class": `${DIALOG_INPUT_STYLE}` })}
	</form>
	${createButtonHtml(["add_friend"], `btn-add-friend`, { "class": `${DIALOG_BTN_STYLE}` })}
`;

function addFriendHandler(modal: HTMLDialogElement): void {
	const addFriendElem = getSafeElement('btn-add-friend', HTMLElement);
	const newFriendElem = getSafeElement('find-friend', HTMLInputElement);

	addFriendElem.addEventListener('click', () => {
		FRIENDLIST.push(newFriendElem.value); /** @todo parse newFriendElem.value */
		generateFriendList();
		modal.close();
	});

	/** @todo add friend in db */
}

export { ADD_FRIEND, addFriendHandler };
