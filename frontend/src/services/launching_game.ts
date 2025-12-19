import { newPoint } from "../game/canvas_creation.js";
import { DataMessage, Status } from "../game/types_transfert.js";
import { getReplyMessage, isRequestSuccessfull, ReplyFromBack, sendGetRequestToBack, sendPostRequestToBack } from "./api_request.js";
import { Errors } from "./status_codes.js";
import { closeDialogID } from "../pages/modules/dialog/dialog.js";
import { AI_RULES, LOCAL_RULES, RANKED_RULES, setGameOptions } from "../game/settings/GameRules.js";

//////////////////////////////////////////
//			Game management				//
//////////////////////////////////////////

async function askForGame(): Promise<boolean> {
	setGameOptions(RANKED_RULES);
	const options = RANKED_RULES;

	const reply = await sendPostRequestToBack("/api/game/ranked_game", JSON.stringify(options));
	const message = await getReplyMessage(reply);
	if (!isRequestSuccessfull(reply)) {
		console.log("Error:", message);
		return false;
	}
	return true;
}

async function waitForGame(): Promise<number | null> {
	let id = -1;
	let reply: ReplyFromBack;
	do {
		reply = await sendGetRequestToBack("/api/game/waiting");
		if (isRequestSuccessfull(reply))
			id = Number(reply.content);
	} while (id < 0 && reply.code !== Errors.GAME_NOT_FOUND);
	if (id >= 0)
		return id;
	return null;
}

async function newRankedGame(): Promise<void> {
	if (!await askForGame())
		return;
	const id = await waitForGame();
	if (id === null)
		return;
	newGameSolo(id);
}

async function newGameVsAI(): Promise<void> {
	setGameOptions(AI_RULES);
	const options = AI_RULES;

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
	closeDialogID('modal');

	const ws = new WebSocket(`ws/${id}`);

	ws.onopen = (): void => {
		console.log("Connected");
		ws.send(JSON.stringify({ id: id }));
	};

	ws.onmessage = (event): void => {
		const message : DataMessage = JSON.parse(event.data);
		switch (message.status) {
			case (Status.OPTIONS):
				newPoint(message, ws);
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
	setGameOptions(LOCAL_RULES);
	const options = LOCAL_RULES;

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
				newPoint(message, player1, player2);
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
