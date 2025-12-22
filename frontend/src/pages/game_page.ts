import { getSafeElement } from "src/utils/getSafeElement";
import { closeDialogID, exitDialog, openDialogGameQuit } from "./modules/dialog/dialog";
import { loadPage } from "src/routes/page";
import { applyColor } from "src/utils/applyColor";

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
	<canvas id='game-canvas' class='h-9/10 w-9/10 rounded-md border-8 border-dark'></canvas>
</div>
`;

function gamePageEvents(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	const ragequit = getSafeElement('btn-quit', HTMLElement);

	modal.addEventListener('click', (e) => exitDialog(modal, e));
	ragequit.addEventListener('click', openDialogGameQuit);
}

function loadGamePage(type: string): void {
	closeDialogID('modal');

	loadPage(GAME_PAGE, gamePageEvents);
	const gametype = getSafeElement('game-type', HTMLElement);

	gametype.innerHTML = type;
}

export { loadGamePage };
