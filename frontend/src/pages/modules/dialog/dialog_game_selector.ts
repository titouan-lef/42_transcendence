import { AI_RULES, loadCheckboxes, LOCAL_RULES, RANKED_RULES } from "src/game/settings/GameRules";
import { loadDialog } from "./dialog";
import { GAME_OPTIONS } from "./dialog_game_options";
import { DIALOG_BTN_STYLE } from "./dialog_style";
import { getSafeElement } from "src/utils/getSafeElement";
import { newGameVsAI, newLocalGame, newRankedGame } from "src/services/launching_game";

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
				elem.addEventListener('click', playVsAi);
				break;
			case 'btn-ranked':
				elem.addEventListener('click', playRanked);
				break;
			case 'btn-back':
				elem.addEventListener('click', openDialogGameSelector);
				break;
			default:
				break;
		}
	});
}

function playGame(type: 'local' | 'ai' | 'ranked'): void {
	switch (type) {
		case 'local':
			newLocalGame();
			break;
		case 'ai':
			newGameVsAI();
			break;
		case 'ranked':
			newRankedGame();
			break;
		default:
			break;
	}
}

function playLocal(): void {
	loadDialog(GAME_OPTIONS, gameSelectorHandler);
	loadCheckboxes(LOCAL_RULES);

	getSafeElement('modal', HTMLDialogElement).dataset.gametype = 'local';

	const go = getSafeElement('btn-go', HTMLElement);

	go.addEventListener('click', newLocalGame);
}

function playVsAi(): void {
	loadDialog(GAME_OPTIONS, gameSelectorHandler);
	loadCheckboxes(AI_RULES);

	getSafeElement('modal', HTMLDialogElement).dataset.gametype = 'ai';

	const go = getSafeElement('btn-go', HTMLElement);

	go.addEventListener('click', newGameVsAI);
}

function playRanked(): void {
	loadDialog(GAME_OPTIONS, gameSelectorHandler);
	loadCheckboxes(RANKED_RULES);

	getSafeElement('modal', HTMLDialogElement).dataset.gametype = 'ranked';

	const go = getSafeElement('btn-go', HTMLElement);

	go.addEventListener('click', newRankedGame);
}

function openDialogGameSelector(): void {
	loadDialog(GAME_SELECTOR, gameSelectorHandler);
}

export { openDialogGameSelector, playRanked, playGame };
