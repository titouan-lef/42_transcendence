import { startOrUpdateGame } from "../game/canvas_creation.js";
import { DataMessage, Status } from "#shared/types_transfert.js";
import { getReplyMessage, isRequestSuccessfull, sendGetRequestToBack, sendPostRequestToBack } from "./api_request.js";
import { getGameOptions } from "../game/settings/GameRules.js";
import { GameTypes } from "src/routes/navigate_types.js";

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

	ws.onopen = (): void => {
		console.log("Connected");
		ws.send(JSON.stringify({ id: id }));
	};

	ws.onmessage = (event): void => {
		const message : DataMessage = JSON.parse(event.data);
		switch (message.status) {
			case (Status.OPTIONS):
				startOrUpdateGame(message, ws);
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

	player1.onopen = (): void => {
		console.log("Player 1 connected"); /** @todo remove */
		player1.send(JSON.stringify({ id: id }));
	};
	player2.onopen = (): void => {
		console.log("Player 2 connected"); /** @todo remove */
		player2.send(JSON.stringify({ id: id }));
	};

	player1.onmessage = (event): void => {
		const message : DataMessage = JSON.parse(event.data);
		switch (message.status) {
			case (Status.OPTIONS):
				startOrUpdateGame(message, player1, player2);
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

export { newRankedGame, newLocalGame, newGameVsAI };
