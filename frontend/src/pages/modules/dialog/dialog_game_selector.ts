import { loadDialog } from "./dialog";
import { loadDialogGameAiOption, loadDialogGameLocalOption, loadDialogGameRankedOption } from "./dialog_game_options";
import { navigateTo } from "../../../routes/navigate";
import { Pages } from "../../../routes/navigate_types";
import { DIALOG_BTN_STYLE } from "./dialog_style";

const GAME_SELECTOR = `
<div class='flex flex-col justify-center items-center gap-8 h-full w-full'>
	<button id='btn-local' class='${DIALOG_BTN_STYLE}'>play local</button>
	<button id='btn-ai' class='${DIALOG_BTN_STYLE}'>play vs AI</button>
	<button id='btn-ranked' class='${DIALOG_BTN_STYLE}'>play ranked</button>
</div>
`;

function gameSelectorHandler(modal: HTMLDialogElement): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-local':
				elem.addEventListener('click', loadDialogGameLocalOption);
				break;
			case 'btn-ai':
				elem.addEventListener('click', loadDialogGameAiOption);
				break;
			case 'btn-ranked':
				elem.addEventListener('click', loadDialogGameRankedOption);
				break;
			default:
				break;
		}
	});
}

function openDialogGameSelector(): void {
	loadDialog(GAME_SELECTOR, gameSelectorHandler);
}

function loadDialogGameSelector(): void {
	navigateTo(Pages.GAME_SELECTION);
}

export { loadDialogGameSelector, openDialogGameSelector };
