import { deleteHandlerByID } from "../routes/event.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { SIGN_IN } from "./sign_in.js";

function loadDialog(handler: (modal: HTMLDialogElement) => void, dialog: string): void {
	const modal = getSafeElement("modal", HTMLDialogElement);

	modal.showModal();
	modal.innerHTML = dialog;
	handler(modal);
}

function exitDialog(id: string, modal: HTMLDialogElement, event: Event): void {
	if (event.target === modal) {
		console.log("clicked out of the dialog."); /** @todo remove debug logs */
		modal.close();
		deleteHandlerByID(id);
		modal.innerHTML = SIGN_IN;
	}
}

export { exitDialog, loadDialog };
