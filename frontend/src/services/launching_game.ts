import { startOrUpdateGame } from "../game/canvas_creation.js";
import { DataMessage, StartMessage, Status } from "#shared/types_transfert.js";
import { getReplyMessage, isRequestSuccessfull, sendPostRequestToBack } from "./api_request.js";
import { getGameOptions } from "../game/settings/GameRules.js";
import { GameTypes } from "../routes/navigate_types.js";
import { getSafeElement } from "../utils/getSafeElement.js";

//////////////////////////////////////////
//			Game management				//
//////////////////////////////////////////

async function newRankedGame(id: number): Promise<void> {
	newGameSolo(id);
}

async function newGameVsAI(): Promise<void> {
	const options = getGameOptions(GameTypes.AI);
	const reply = await sendPostRequestToBack("/api/game/ai_game", JSON.stringify(options));
	if (!isRequestSuccessfull(reply)) {
		console.log("Error:",reply.code, getReplyMessage(reply));
		return;
	}
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

	ws.onerror = (err): void => {
		console.error("WebSocket error:", err);
	};

	ws.onclose = (event): void => {
		console.log("Closed:", event.code, event.reason);
	};
}

async function newLocalGame(): Promise<void> {
	const options = getGameOptions(GameTypes.LOCAL);
	const reply = await sendPostRequestToBack("/api/game/local_game", JSON.stringify(options));
	if (!isRequestSuccessfull(reply)) {
		console.log("Error:",reply.code, getReplyMessage(reply));
		return;
	}
	const id = Number(reply.content);
	if (id < 0) {
		console.log("Negative ID"); /** @todo remove */
		return;
	}

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

	player1.onerror = (err): void => {
		console.error("Player 1 WebSocket error:", err);
	};
	player2.onerror = (err): void => {
		console.error("Player 2 WebSocket error:", err);
	};

	player1.onclose = (event): void => {
		console.log("Player 1 closed:", event.code, event.reason);
	};
	player2.onclose = (event): void => {
		console.log("Player 2 closed:", event.code, event.reason);
	};
}


const GAME_INFOS_STYLE = `
flex-1 min-w-0
truncate
`;

/** @todo get my nickname, opponent's nickname, my elo, oppo elo from back*/
function loadGameHeader(infos: StartMessage): void {

	const gameType = getSafeElement('game-type', HTMLElement).innerHTML;

	const elem = getSafeElement(`players-infos`, HTMLElement);
	switch (gameType) {
		case (GameTypes.LOCAL):
			elem.innerHTML = `
			<div class='${GAME_INFOS_STYLE}'>Player 1</div>
			<div class='${GAME_INFOS_STYLE}'>-</div>
			<div class='${GAME_INFOS_STYLE}'>Player 2</div>
			`;
			break;
		case (GameTypes.AI):
			elem.innerHTML = `
			<div class='${GAME_INFOS_STYLE}'>${infos.playerName}</div>
			<div class='${GAME_INFOS_STYLE}'>${infos.playerRating}</div>
			<div class='${GAME_INFOS_STYLE}'>-</div>
			<div class='${GAME_INFOS_STYLE}'>IA</div>
			`;
			break;
		case (GameTypes.RANKED):
			elem.innerHTML = `
			<div class='${GAME_INFOS_STYLE}'>${infos.playerName}</div>
			<div class='${GAME_INFOS_STYLE}'>${infos.playerRating}</div>
			<div class='${GAME_INFOS_STYLE}'>-</div>
			<div class='${GAME_INFOS_STYLE}'>${infos.enemyName}</div>
			<div class='${GAME_INFOS_STYLE}'>${infos.enemyRating}</div>
			`;
			break;
		default:
			throw new Error("No such game type.");
	}	
}

export { newRankedGame, newLocalGame, newGameVsAI };
