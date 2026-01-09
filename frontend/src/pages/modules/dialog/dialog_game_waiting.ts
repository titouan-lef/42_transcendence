import { newRankedGame } from "../../../services/launching_game";
import { getSafeElement } from "../../../utils/getSafeElement";
import { closeDialogID, loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE } from "./dialog_style";
import { goBack, navigateTo } from "../../../routes/navigate";
import { Modals, GameTypes, Pages } from "../../../routes/navigate_types";
import { getGameOptions } from "../../../game/settings/GameRules";
import { gamePageEvents } from "../../../pages/events/game_page_event";
import { wait } from "../../../utils/time";
import { Status, Waiting } from "#shared/types_transfert";

const GIF_STYLE = `
rounded-2xl
bg-white
w-9/10
h-7/10
overflow-hidden
`;

let ws: WebSocket | null = null;

/** @todo front */
function getGameWaiting(): string {
	return `
	<div class='flex flex-col gap-4 justify-center items-center w-full h-full'>
		<p class='text-[20px]'>Waiting for a game...</p>
		<div class='${GIF_STYLE}'>
			<img src='${getRandomGifPath()}' alt='waiting GIF' class='w-full h-full object-cover'/>
		</div>
		<button id='btn-cancel' class='${DIALOG_BTN_STYLE}'>cancel</button>
	</div>
	`;
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomGifPath(): string {
	const path = './images/waiting_screen/waiting_' + randomInt(1, 8) + '.gif';
	return path;
}

async function gameWaitingHandler(): Promise<void> {
	const elem = getSafeElement('btn-cancel', HTMLElement);
	elem.addEventListener('click', goBack);

	waitForGame();
}

async function cancelQueue(): Promise<void> {
	ws?.close(1000);
	ws = null;
}

async function waitForGame(): Promise<void> {

	ws = new WebSocket(`/ws/waiting`);

	const options = getGameOptions(GameTypes.RANKED);

	ws.onmessage = (event): void => {
		try {
			const message: Waiting = JSON.parse(event.data); /** @todo check number ?? */
			switch (message.status) {
				case (Status.START):
					ws?.send(JSON.stringify(options));
					break;
				case (Status.OPTIONS):
					if (message.id !== undefined) {
						launchGame(message.id);
						cancelQueue();
					}
					break;
				default:
					throw new Error("No such waiting status");
			}
		} catch {
			goBack();
		}
	};

	ws.onerror = (err): void => {
		console.error("WebSocket error:", err);
	};

	ws.onclose = (event): void => {
		console.log("Closed:", event.code, event.reason);
		if (event.code !== 1000)
			goBack();
	};
}

function launchGame(id: number): void {
	closeDialogID('modal');
	gamePageEvents();
	newRankedGame(id);
}

function openDialogWaiting(): void {
	loadDialog(getGameWaiting(), gameWaitingHandler);
}

function loadDialogWaiting(): void {
	navigateTo(Modals.WAITING);
}

export { openDialogWaiting, loadDialogWaiting, cancelQueue };
