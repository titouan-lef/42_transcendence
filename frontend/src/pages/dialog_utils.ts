import { getSafeElement } from "../utils/getSafeElement.js";

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
	}
}

export { exitDialog, loadDialog };
