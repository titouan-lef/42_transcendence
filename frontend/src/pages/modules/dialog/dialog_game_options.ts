import { goBack, navigateTo } from "../../../routes/navigate";
import { loadDialog } from "./dialog";
import { createCheckbox } from "../../../assets/svgs/svgs_boxes";
import { SVG_BALL_DEFAULT, SVG_BALL_INVISIBLE, SVG_BALL_PULSE, SVG_BALL_SNAKE, SVG_BALL_TRICKY, SVG_CANON, SVG_MAP_DEFAULT, SVG_MAP_DESERT, SVG_MAP_SKY, SVG_MAP_VOLCANO, SVG_RULE_DASH, SVG_RULE_PROT, SVG_RULE_SPIN, SVG_RULE_WIND } from "../../../assets/svgs/svgs";
import { DIALOG_BTN_STYLE, DIALOG_SEPARATOR_STYLE } from "./dialog_style";
import { GameTypes, Pages } from "../../../routes/navigate_types";
import { getSafeElement } from "../../../utils/getSafeElement";
import { loadCheckboxes } from "../../../game/settings/GameRules";
import { loadLocalGamePage, loadRankedGamePage, loadSoloGamePage } from "../../../pages/game_page";

/** @todo front */
const GAME_OPTIONS_MAPS = `
<div class='flex flex-row gap-4'>
	<div class='text-20 font-bold'>
		select maps
	</div>
	<div id='chk-map' class='flex flex-row gap-4'>
		${createCheckbox('chk-map-default', SVG_MAP_DEFAULT, 'default')}
		${createCheckbox('chk-map-volcano', SVG_MAP_VOLCANO, 'volcano')}
		${createCheckbox('chk-map-sky', SVG_MAP_SKY, 'sky')}
		${createCheckbox('chk-map-desert', SVG_MAP_DESERT, 'desert')}
	</div>
</div>
`;

const GAME_OPTIONS_BALLS = `
<div class='flex flex-row gap-4'>
	<div class='text-20 font-bold'>
		select balls
	</div>
	<div id='chk-ball' class='flex flex-row gap-4'>
		${createCheckbox('chk-ball-default', SVG_BALL_DEFAULT, 'default')}
		${createCheckbox('chk-ball-invisible', SVG_BALL_INVISIBLE, 'invisible')}
		${createCheckbox('chk-ball-pulse', SVG_BALL_PULSE, 'pulse')}
		${createCheckbox('chk-ball-snake', SVG_BALL_SNAKE, 'snake')}
		${createCheckbox('chk-ball-tricky', SVG_BALL_TRICKY, 'tricky')}
	</div>
</div>
`;

const GAME_OPTIONS_RULES = `
<div class='flex flex-row gap-4'>
	<div class='text-20 font-bold'>
		rules
	</div>
	<div class='flex flex-row gap-4'>
		${createCheckbox('chk-rule-dash', SVG_RULE_DASH)}
		${createCheckbox('chk-rule-prot', SVG_RULE_PROT)}
		${createCheckbox('chk-rule-spin', SVG_RULE_SPIN)}
		${createCheckbox('chk-rule-wind', SVG_RULE_WIND)}
	</div>
</div>
`;

const GAME_OPTIONS_CANON = `
<div class='flex flex-row gap-4'>
	<div class='text-20 font-bold'>
		canon numbers
	</div>
	${SVG_CANON}
	<div class='flex flex-row gap-4'>
		<input type="range" id="canon-nbr" name="canon-nbr" value="0" min="0" max="2"/>
	</div>
</div>
`;

const GAME_OPTIONS = `
	<div class="flex flex-col gap-4 p-10">
		${GAME_OPTIONS_MAPS}
		${GAME_OPTIONS_BALLS}
		${GAME_OPTIONS_RULES}
		${GAME_OPTIONS_CANON}
	</div>
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	<button id='btn-back' class='${DIALOG_BTN_STYLE}'>back</button>
	<button id='btn-go' class='${DIALOG_BTN_STYLE}'>GO</button>
`;

function optionSelectorHandler(modal: HTMLDialogElement,  startGame: () => void): void {
	const allElements = modal.querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-back':
				elem.addEventListener('click', goBack);
				break;
			case 'btn-go':
				elem.addEventListener('click', startGame);
				break;
			default:
				break;
		}
	});
}

let currentGameType: GameTypes = GameTypes.RANKED; /** @todo ranked by default ? in case of error */

/** @todo better? cound not get a function with two args to loadDialog */
function openDialogGameOption(): void {
	loadDialog(GAME_OPTIONS, () => {});
	loadCheckboxes(currentGameType);
	const modal = getSafeElement("modal", HTMLDialogElement);
	switch (currentGameType) {
		case GameTypes.LOCAL:
			optionSelectorHandler(modal, loadLocalGamePage);
			break;
		case GameTypes.AI:
			optionSelectorHandler(modal, loadSoloGamePage);
			break;
		case GameTypes.RANKED:
			optionSelectorHandler(modal, loadRankedGamePage);
			break;
		default:
			throw new Error("No such game type");
	}
}

function loadDialogGameOption(gameType: GameTypes): void {
	currentGameType = gameType;
	navigateTo(Pages.GAME_OPTIONS);
}

function loadDialogGameLocalOption(): void {
	loadDialogGameOption(GameTypes.LOCAL);
}
 
function loadDialogGameAiOption(): void {
	loadDialogGameOption(GameTypes.AI);
}

function loadDialogGameRankedOption(): void {
	loadDialogGameOption(GameTypes.RANKED);
}

export { openDialogGameOption, loadDialogGameLocalOption, loadDialogGameAiOption, loadDialogGameRankedOption };
