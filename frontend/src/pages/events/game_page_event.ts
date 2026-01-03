import { getSafeElement } from "../../utils/getSafeElement";
import { closeDialogID } from "../modules/dialog/dialog";
import { openDialogGameQuit } from "../modules/dialog/dialog_game_quit";

function gamePageEvents(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	const ragequit = getSafeElement('btn-quit', HTMLElement);

	modal.addEventListener('click', (e) => {
		if (e.target === modal)
			closeDialogID(`modal`);
	});
	ragequit.addEventListener('click', openDialogGameQuit);
}

export { gamePageEvents };
