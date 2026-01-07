import { navigateTo } from "../../../routes/navigate";
import { getSafeElement } from "../../../utils/getSafeElement";
import { closeDialogID, loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE } from "./dialog_style";
import { Pages } from "../../../routes/navigate_types";

const GAME_QUIT = `
<div class='flex flex-col gap-4 justify-around w-full h-full'>
	<div class='flex flex-col gap-4 w-full h-fit justify-center items-center'>
		<div class='text-[20px]'>Are you sure you want to quit ?</div>
		<div class='text-warning text-[14px]'>this will count as a defeat</div>
	</div>
	<div class='flex flex-col gap-4 w-full h-fit justify-center items-center'>
		<button id='btn-yes' class='${DIALOG_BTN_STYLE}'>yes, I want to quit</button>
		<button id='btn-cancel' class='${DIALOG_BTN_STYLE}'>no, go back to game</button>
	</div>
</div>
`;

function gameQuitHandler(): void {
	const allElements = getSafeElement('modal', HTMLDialogElement).querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-yes':
				elem.addEventListener('click', () => navigateTo(Pages.HOME));
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
