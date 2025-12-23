import { closeDialogID, loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE } from "./dialog_style";

/** @todo front */
const GAME_QUIT = `
<div class='flex flex-col gap-4'>
	<div class='text-20'>Are you sure you want to quit ?</div>
	<div class='text-warning text-10'>this will count as a defeat</div>
	<button id='btn-yes' class='${DIALOG_BTN_STYLE}'>yes, I want to quit</button>
	<button id='btn-cancel' class='${DIALOG_BTN_STYLE}'>no, go back to game</button>
</div>
`;

function quitGame(): void {
	/** @todo ragequit event */
	console.log("sorry can't leave game"); /** @todo remove */
	closeDialogID('modal');
}

function gameQuitHandler(modal: HTMLDialogElement): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-yes':
				elem.addEventListener('click', quitGame);
				break;
			case 'btn-cancel':
				elem.addEventListener('click', () => closeDialogID('modal'));
				break;
			default:
				break;
		}
	});
}

function openDialogGameQuit(): void {
	loadDialog(GAME_QUIT, gameQuitHandler);
}

export { openDialogGameQuit };
