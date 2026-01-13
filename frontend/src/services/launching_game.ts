import { startOrUpdateGame } from "../game/canvas_creation.js";
import { DataMessage, StartMessage, Status } from "#shared/types_transfert.js";
import { getReplyMessage, isRequestSuccessfull, sendPostRequestToBack } from "./api_request.js";
import { getGameOptions } from "../game/settings/GameRules.js";
import { GameTypes } from "../routes/navigate_types.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { getGameType } from "../game/gameType.js";

const GAME_INFOS_STYLE = `
max-w-[200px] text-[30px] truncate shrink-0
`;

//////////////////////////////////////////
//			Game management				//
//////////////////////////////////////////

async function newRankedGame(id: number): Promise<void> {
	newGameSolo(id);
}

async function newGameVsAI(): Promise<void> {
	const options = getGameOptions(GameTypes.AI);
	const reply = await sendPostRequestToBack("/api/game/ai_game", JSON.stringify(options));
	if (!isRequestSuccessfull(reply))
		return;
	const id = Number(reply.content);
	if (id >= 0)
		newGameSolo(id);
}

//////////////////////////////////////////
//		WebSocket management			//
//////////////////////////////////////////

async function newGameSolo(id: number): Promise<void> {
	const ws = new WebSocket(`ws/${id}`);

	ws.onmessage = (event): void => {
		const message : DataMessage = JSON.parse(event.data);
		switch (message.status) {
			case (Status.OPTIONS):
				startOrUpdateGame(message, ws);
				break;
			case (Status.START):
				loadGameHeader(message);
				break;
			default:
				return;
		}
	};
}

async function newLocalGame(): Promise<void> {
	const options = getGameOptions(GameTypes.LOCAL);
	const reply = await sendPostRequestToBack("/api/game/local_game", JSON.stringify(options));
	if (!isRequestSuccessfull(reply))
		return;
	const id = Number(reply.content);
	if (id < 0)
		return;

	const player1 = new WebSocket(`ws/${id}`);
	const player2 = new WebSocket(`ws/${id}`);

	player1.onmessage = (event): void => {
		const message : DataMessage = JSON.parse(event.data);
		switch (message.status) {
			case (Status.OPTIONS):
				startOrUpdateGame(message, player1, player2);
				break;
			case (Status.START):
				loadGameHeader(message);
				break;
			default:
				return;
		}
	};
}

function loadGameHeader(infos: StartMessage): void {
	const gameType = getGameType();

	const elem = getSafeElement(`players-infos`, HTMLElement);
	switch (gameType) {
		case (GameTypes.LOCAL):
			elem.innerHTML = `
			<div class='${GAME_INFOS_STYLE}'>Player 1</div>
			<div class='text-[12px]'>VS</div>
			<div class='${GAME_INFOS_STYLE}'>Player 2</div>
			`;
			break;
		case (GameTypes.AI):
			elem.innerHTML = `
			<div class='${GAME_INFOS_STYLE}'>${infos.playerNickname}</div>
			<div class='text-[12px] text-variant h-full align-bottom'>${infos.playerRating > 0 ? `${infos.playerRating} elo` : '-'}</div>
			<div class='text-[12px]'>VS</div>
			<div class='${GAME_INFOS_STYLE}'>AI</div>
			`;
			break;
		case (GameTypes.RANKED):
			elem.innerHTML = `
			<div class='${GAME_INFOS_STYLE}'>${infos.playerNickname}</div>
			<div class='text-[12px] text-variant h-full align-bottom'>${infos.playerRating > 0 ? `${infos.playerRating} elo` : '-'}</div>
			<div class='text-[12px]'>VS</div>
			<div class='text-[12px] text-variant h-full align-bottom'>${infos.enemyRating > 0 ? `${infos.enemyRating} elo` : '-'}</div>
			<div class='${GAME_INFOS_STYLE}'>${infos.enemyNickname}</div>
			`;
			break;
		default:
			throw new Error("No such game type.");
	}
}

export { newRankedGame, newLocalGame, newGameVsAI };
