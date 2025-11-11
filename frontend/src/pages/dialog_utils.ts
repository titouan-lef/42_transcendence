import { deleteHandlerByID } from "../routes/event.js";

function exitDialog(id: string, modal: HTMLDialogElement, event: Event): void {
	if (event.target === modal) {
		console.log("clicked out of the dialog."); /** @todo remove debug logs */
		modal.close();
		deleteHandlerByID(id);
	}
}

export { exitDialog };
