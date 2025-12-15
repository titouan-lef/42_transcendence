import { newGame } from "../game/canvas_creation.js";
import { BallOption, MapOption } from "../game/settings/GameSettings.js";
import { DataMessage, Status } from "../game/types_transfert.js";
import { getReplyMessage, isRequestSuccessfull, ReplyFromBack, sendGetRequestToBack, sendPostRequestToBack } from "./api_request.js";
import { Errors } from "./status_codes.js";

declare const WS_URL: string; // just telling the compiler that API_URL and WS_URL will exists during execution

//////////////////////////////////////////
//			Game management				//
//////////////////////////////////////////

interface GameOptions { /** @toto include GameOptions in GameSettings ? */
	map: MapOption[];
	ball: BallOption[];
	rotatingPlayer: boolean;
	spin: boolean;
	windAffectsBall: boolean;
	dashingPlayer: boolean;
	canonCount: number;
}

async function askForGame(): Promise<boolean> {
	/** @todo get options from front interface */
	const canonCount = Math.random() > 0.5 ? 0 : 2;
	const options : GameOptions = {
		map: ["default", "sky", "volcano", "desert"],
		ball: ["default", "snake", "tricky", "invisible", "pulse"],
		rotatingPlayer: true,
		spin: true,
		windAffectsBall: true,
		dashingPlayer: true,
		canonCount: canonCount
	};
	console.log("canon count: " + canonCount); /**@todo remove */
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
	/** @todo get options from front interface */
	const options : GameOptions = {
		map: ["default", "sky", "volcano", "desert"],
		ball: ["default", "snake", "tricky", "invisible", "pulse"],
		rotatingPlayer: true,
		spin: true,
		windAffectsBall: true,
		dashingPlayer: true,
		canonCount: 1
	};

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
	const ws = new WebSocket(`${WS_URL}/${id}`);

	ws.onopen = (): void => {
		console.log("Connected");
		ws.send(JSON.stringify({ id: id }));
	};

	ws.onmessage = (event): void => {
		const message : DataMessage = JSON.parse(event.data);
		switch (message.status) {
			case (Status.OPTIONS):
				newGame(message, ws);
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
	/** @todo get options from front interface */
	const options : GameOptions = {
		map: ["default", "sky", "volcano", "desert"],
		ball: ["default", "snake", "tricky", "invisible", "pulse"],
		rotatingPlayer: true,
		spin: true,
		windAffectsBall: true,
		dashingPlayer: true,
		canonCount: 1
	};

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

	const player1 = new WebSocket(`${WS_URL}/${id}`);
	const player2 = new WebSocket(`${WS_URL}/${id}`);

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
				newGame(message, player1, player2);
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
