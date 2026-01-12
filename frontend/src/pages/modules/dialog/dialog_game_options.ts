import { goBack, navigateTo } from "../../../routes/navigate";
import { loadDialog } from "./dialog";
import { createCheckbox } from "../../../assets/svgs/svgs_boxes";
import { SVG_BALL_DEFAULT, SVG_BALL_INVISIBLE, SVG_BALL_PULSE, SVG_BALL_SNAKE, SVG_BALL_TRICKY, SVG_CANON, SVG_MAP_DEFAULT, SVG_MAP_DESERT, SVG_MAP_SKY, SVG_MAP_VOLCANO, SVG_RULE_DASH, SVG_RULE_PROT, SVG_RULE_SPIN, SVG_RULE_WIND } from "../../../assets/svgs/svgs";
import { DIALOG_BTN_STYLE, DIALOG_SEPARATOR_STYLE } from "./dialog_style";
import { GameTypes, Pages } from "../../../routes/navigate_types";
import { getSafeElement } from "../../../utils/getSafeElement";
import { loadCheckboxes } from "../../../game/settings/GameRules";
import { loadLocalGamePage, loadRankedGamePage, loadSoloGamePage } from "../../../pages/game_page";

const GAME_OPTIONS_STYLE = `
flex flex-row gap-4 flex-1 min-h-0 min-w-0
`;

const LABEL_STYLE = `
text-20 font-bold text-right
`;

const GAME_OPTIONS_MAPS = `
<div class='${LABEL_STYLE}'>
	select maps
</div>
<div id='chk-map' class='${GAME_OPTIONS_STYLE}'>
	${createCheckbox('chk-map-default', SVG_MAP_DEFAULT, 'default')}
	${createCheckbox('chk-map-volcano', SVG_MAP_VOLCANO, 'volcano')}
	${createCheckbox('chk-map-sky', SVG_MAP_SKY, 'sky')}
	${createCheckbox('chk-map-desert', SVG_MAP_DESERT, 'desert')}
</div>
`;

const GAME_OPTIONS_BALLS = `
<div class='${LABEL_STYLE}'>
	select balls
</div>
<div id='chk-ball' class='${GAME_OPTIONS_STYLE}'>
	${createCheckbox('chk-ball-default', SVG_BALL_DEFAULT, 'default')}
	${createCheckbox('chk-ball-invisible', SVG_BALL_INVISIBLE, 'invisible')}
	${createCheckbox('chk-ball-pulse', SVG_BALL_PULSE, 'pulse')}
	${createCheckbox('chk-ball-snake', SVG_BALL_SNAKE, 'snake')}
	${createCheckbox('chk-ball-tricky', SVG_BALL_TRICKY, 'tricky')}
</div>
`;

const GAME_OPTIONS_RULES = `
<div class='${LABEL_STYLE}'>
	select rules
</div>
<div class='${GAME_OPTIONS_STYLE}'>
	${createCheckbox('chk-rule-dash', SVG_RULE_DASH)}
	${createCheckbox('chk-rule-prot', SVG_RULE_PROT)}
	${createCheckbox('chk-rule-spin', SVG_RULE_SPIN)}
	${createCheckbox('chk-rule-wind', SVG_RULE_WIND)}
</div>
`;

const GAME_OPTIONS_CANON = `
<div class='${LABEL_STYLE}'>
	canon numbers
</div>
<div class='${GAME_OPTIONS_STYLE}'>
	${SVG_CANON}
	<input type="range" id="canon-nbr" name="canon-nbr" value="0" min="0" max="2"/>
</div>
`;

const GAME_OPTIONS = `
<div class="grid grid-cols-[auto_1fr] grid-rows-4 gap-4 items-center">
	${GAME_OPTIONS_MAPS}
	${GAME_OPTIONS_BALLS}
	${GAME_OPTIONS_RULES}
	${GAME_OPTIONS_CANON}
</div>
<hr class="${DIALOG_SEPARATOR_STYLE}">
<button id='btn-go' class='${DIALOG_BTN_STYLE}'>GO</button>
<button id='btn-back' class='${DIALOG_BTN_STYLE}'>back</button>
`;

let currentGameType: GameTypes = GameTypes.RANKED;

function optionSelectorHandler(modal: HTMLDialogElement, startGame: () => void): void {
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
	lockLastCheckbox("chk-map");
	lockLastCheckbox("chk-ball");
}

function lockLastCheckbox(containerId: string): void {
	const container = getSafeElement(containerId, HTMLElement);

	const checkboxes = Array.from(
		container.querySelectorAll<HTMLInputElement>("input[type='checkbox']")
	);

	function updateState(): void {
		const checked = checkboxes.filter(cb => cb.checked);

		checkboxes.forEach(cb => {
			cb.disabled = checked.length === 1 && cb.checked;
		});
	};

	checkboxes.forEach(cb => {
		cb.addEventListener("change", updateState);
	});

	updateState();
}

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
			return;
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
