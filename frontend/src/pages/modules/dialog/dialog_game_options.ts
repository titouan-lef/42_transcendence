import { BallOption, MapOption } from "../../../game/settings/PointSettings";
import { newGameVsAI, newLocalGame, newRankedGame } from "../../../services/launching_game";
import { getSafeElement } from "../../../utils/getSafeElement";
import { openDialogGameOptions } from "./dialog";
import { DIALOG_BTN_STYLE, DIALOG_SEPARATOR_STYLE } from "./dialog_style";

interface GameOptions {
	map: MapOption[];
	ball: BallOption[];
	rotatingPlayer: boolean;
	spin: boolean;
	windAffectsBall: boolean;
	dashingPlayer: boolean;
	canonCount: number;
}

/** @todo front */
const GAME_OPTIONS = `
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	<button id='btn-go' class='${DIALOG_BTN_STYLE}'>GO</button>
`;

function playLocal(): void {
	openDialogGameOptions();
	const go = getSafeElement('btn-go', HTMLElement);

	go.addEventListener('click', newLocalGame);
}

function playVSAI(): void {
	openDialogGameOptions();
	const go = getSafeElement('btn-go', HTMLElement);

	go.addEventListener('click', newGameVsAI);
}

function playRanked(): void {
	openDialogGameOptions();
	const go = getSafeElement('btn-go', HTMLElement);

	go.addEventListener('click', newRankedGame);
}

function gameOptionsHandler(modal: HTMLDialogElement): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'map-selector':
				console.log('maps');
				break;
			default:
				break;
		}
	});
}

function getGameOptions(): GameOptions {
	return {
		map: ["default", "sky", "volcano", "desert"],
		ball: ["default", "snake", "tricky", "invisible", "pulse"],
		rotatingPlayer: true,
		spin: true,
		windAffectsBall: true,
		dashingPlayer: true,
		canonCount: 1
	};
}

export { GAME_OPTIONS, gameOptionsHandler, getGameOptions };
export { playLocal, playVSAI, playRanked };
