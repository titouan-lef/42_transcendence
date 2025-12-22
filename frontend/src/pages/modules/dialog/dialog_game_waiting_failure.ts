import { newRankedGame } from "../../../services/launching_game"; /** @todo (cancel) remove if not working, see event comment below */
import { openDialogGameSelector } from "./dialog";
import { playRanked } from "./dialog_game_options"; /** @todo (cancel) remove if use newRankedGame instead */
import { DIALOG_BTN_STYLE } from "./dialog_style";

/** @todo front */
const GAME_WAITING_FAILURE = `
<div class='flex flex-col gap-4'>
	<p>No game found</p>
	<button id='btn-retry' class='${DIALOG_BTN_STYLE}'>retry</button>
	<button id='btn-back' class='${DIALOG_BTN_STYLE}'>back</button>
</div>
`;

function gameWaitingFailureHandler(modal: HTMLDialogElement): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-retry':
				elem.addEventListener('click', playRanked); /** @todo (cancel) after cancel done, check if replacing playRanked by newRankedGame works */
				break;
			case 'btn-back':
				elem.addEventListener('click', openDialogGameSelector);
				break;
			default:
				break;
		}
	});
}

export { GAME_WAITING_FAILURE, gameWaitingFailureHandler };
