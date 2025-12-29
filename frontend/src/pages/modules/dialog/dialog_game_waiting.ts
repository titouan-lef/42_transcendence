import { newRankedGame } from "src/services/launching_game";
import { getSafeElement } from "../../../utils/getSafeElement";
import { closeDialogID, loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE } from "./dialog_style";
import { navigateTo, navigationGameFound } from "src/routes/navigate";
import { GameModals, GameTypes } from "src/routes/navigate_types";
import { getReplyMessage, isRequestSuccessfull, ReplyFromBack, sendGetRequestToBack, sendPostRequestToBack } from "src/services/api_request";
import { Errors } from '#shared/status_codes';
import { getGameOptions } from "src/game/settings/GameRules";
import { gamePageEvents } from "src/pages/game_page";

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

async function sendCancelQueue(): Promise<void> {
	const reply = await sendGetRequestToBack("/api/game/cancel_queue");
	if (!isRequestSuccessfull(reply)) {
		console.log("Error:", reply.content);
		return;
	}
	return;
}

async function waitForGame(): Promise<number | null> {
	let id = -1;
	let reply: ReplyFromBack;
	do {
		reply = await sendGetRequestToBack("/api/game/waiting");
		if (isRequestSuccessfull(reply))
			id = Number(reply.content);
	} while (id < 0 && reply.code !== Errors.NOT_IN_QUEUE);
	if (id >= 0)
		return id;
	return null;
}

async function askForGame(): Promise<boolean> {
	const options = getGameOptions(GameTypes.RANKED);
	const reply = await sendPostRequestToBack("/api/game/ranked_game", JSON.stringify(options));
	const message = getReplyMessage(reply);
	if (!isRequestSuccessfull(reply)) {
		console.log("Error:", message);
		return false;
	}
	return true;
}

async function gameWaitingHandler(): Promise<void> {
	const elem = getSafeElement('btn-cancel', HTMLElement);
	elem.addEventListener('click', sendCancelQueue);

	if (!await askForGame())
		return;
	const id = await waitForGame();
	if (id === null) { // => queue got canceled
		/**@todo will pop even if we click outside of the modal, but its fine tbh*/
		return;
	}
	closeDialogID('modal');
	navigationGameFound();
	gamePageEvents();
	newRankedGame(id);
}

function openDialogWaiting(): void {
	loadDialog(GAME_WAITING, gameWaitingHandler);
}

function loadDialogWaiting(): void {
	navigateTo(GameModals.WAITING);
}

export { openDialogWaiting, loadDialogWaiting, sendCancelQueue };
