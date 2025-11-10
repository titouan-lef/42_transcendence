import { deleteHandlerByID } from "../routes/event.js";

// function exitDialog(id: string, modal: HTMLDialogElement, event: Event): void {
// 	if (event instanceof PointerEvent) {
// 		const rect = modal.getBoundingClientRect();
// 		const isInDialog =
// 			event.clientX >= rect.left &&
// 			event.clientX <= rect.right &&
// 			event.clientY >= rect.top &&
// 			event.clientY <= rect.bottom;

// 		if (!isInDialog) {
// 			console.log("clicked out of the dialog."); /** @todo remove debug logs */
// 			modal.close();
// 			deleteHandlerByID(id);
// 		}
// 	}
// }

function exitDialog(id: string, modal: HTMLDialogElement, event: Event): void {
	if (event.target === modal) {
		console.log("clicked out of the dialog."); /** @todo remove debug logs */
		modal.close();
		deleteHandlerByID(id);
	}
}

export { exitDialog };
