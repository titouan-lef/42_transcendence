import { getSafeElement } from "../../../utils/getSafeElement";
import { openDialogGameSelector } from "./dialog";
import { DIALOG_BTN_STYLE } from "./dialog_style";

const GIF_STYLE = `
rounded-2xl
bg-white
w-[250px]
h-[150px]
overflow-hidden
`;

/** @todo front */
const GAME_WAITING = `
<div class='flex flex-col gap-4'>
	<p>Waiting for a game...</p>
	<div class='${GIF_STYLE}'>
		<img src='${getRandomGifPath()}' alt='waiting GIF' class='w-full h-full object-cover'/>
	</div>
	<button id='btn-cancel' class='${DIALOG_BTN_STYLE}'>cancel</button>
</div>
`;

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomGifPath(): string {
	const path = './images/waiting_screen/waiting_' + randomInt(1, 8) + '.gif';

	return path;
}

function cancelGame(): void {
	/** @todo (cancel) do smth to cancel */
	//	if (isWaitingForGame)
	//		sendCancelToBack();
	openDialogGameSelector();
}

function gameWaitingHandler(): void {
	const elem = getSafeElement('btn-cancel', HTMLElement);

	elem.addEventListener('click', cancelGame);
}

export { GAME_WAITING, gameWaitingHandler };
