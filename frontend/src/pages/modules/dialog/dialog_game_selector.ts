import { playLocal, playRanked, playVSAI } from "./dialog_game_options";
import { DIALOG_BTN_STYLE } from "./dialog_style";

/** @todo front */
const GAME_SELECTOR = `
<div class='flex flex-col gap-4'>
	<button id='btn-local' class='${DIALOG_BTN_STYLE}'>local</button>
	<button id='btn-ai' class='${DIALOG_BTN_STYLE}'>vs AI</button>
	<button id='btn-ranked' class='${DIALOG_BTN_STYLE}'>ranked</button>
</div>
`;

function gameSelectorHandler(modal: HTMLDialogElement): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-local':
				elem.addEventListener('click', playLocal);
				break;
			case 'btn-ai':
				elem.addEventListener('click', playVSAI);
				break;
			case 'btn-ranked':
				elem.addEventListener('click', playRanked);
				break;
			default:
				break;
		}
	});
}

export { GAME_SELECTOR, gameSelectorHandler };
