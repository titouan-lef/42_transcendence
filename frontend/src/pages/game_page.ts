import { getSafeElement } from "../utils/getSafeElement";
import { loadPage } from "./page";
import { applyColor } from "../utils/applyColor";
import { navigateTo } from "../routes/navigate";
import { GameTypes, Pages } from "../routes/navigate_types";
import { newGameVsAI, newLocalGame } from "../services/launching_game";
import { registerGameOptions } from "../game/settings/GameRules";
import { loadDialogWaiting } from "./modules/dialog/dialog_game_waiting";
import { gamePageEvents } from "./events/game_page_event";

const GAME_PAGE_STYLE = `
flex flex-col gap-[10px]
justify-center items-center
p-[10px]
min-h-screen max-h-screen
${applyColor('alt')}
`;

const GAME_QUIT_BTN_STYLE = `
flex items-center justify-center
`;

const GAME_QUIT_BTN_SVG = `
<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none" stroke="currentColor"
		class="size-[30px] stroke-2 text-variant">
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>
`;

/** @todo get my nickname, opponent's nickname, my elo, oppo elo from back*/
const GAME_INFOS = `
<div>my nickname</div>
<div>[my elo]</div>
<div>-</div>
<div>opponent's name</div>
<div>[oppo elo]</div>
`;

const GAME_PAGE = `
<dialog id='modal'></dialog>
<div class='${GAME_PAGE_STYLE}'>
	<div id='game-infos' class='flex flex-row w-4/5 justify-between gap-8'>
		<div class='text-20 font-jaro'>PONG</div>
		<div class='flex flex-row'>
			game type :
			<p id='game-type'></p>
		</div>
		<div class='grow flex flex-row gap-2'>
			${GAME_INFOS}
		</div>
		<div id='btn-quit' class='${GAME_QUIT_BTN_STYLE}'>
			${GAME_QUIT_BTN_SVG}
		</div>
	</div>
	<canvas id='game-canvas' class='h-4/5 w-4/5 rounded-md border-8 border-dark'></canvas>
</div>
`;

let gameType: GameTypes | null = null;

function openGamePage(): void {
	if (!gameType)
		return ;

	loadPage(GAME_PAGE, () => {});

	switch (gameType) {
		case (GameTypes.LOCAL):
			gamePageEvents();
			newLocalGame();
			break;
		case (GameTypes.AI):
			gamePageEvents();
			newGameVsAI();
			break;
		case (GameTypes.RANKED):
			loadDialogWaiting();
			break;
		default:
			throw new Error("No such game type.");
	}
	getSafeElement('game-type', HTMLElement).innerHTML = gameType;
}

function loadGamePage(type: GameTypes): void {
	gameType = type;
	navigateTo(Pages.GAME);
}

function loadLocalGamePage(): void {
	registerGameOptions(GameTypes.LOCAL);
	loadGamePage(GameTypes.LOCAL);
}

function loadSoloGamePage(): void {
	registerGameOptions(GameTypes.AI);
	loadGamePage(GameTypes.AI);
}

function loadRankedGamePage(): void {
	registerGameOptions(GameTypes.RANKED);
	loadGamePage(GameTypes.RANKED);
}

export { loadLocalGamePage, loadSoloGamePage, loadRankedGamePage, openGamePage };
