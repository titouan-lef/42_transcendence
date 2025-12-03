import { newGame, updateGameObject } from "../game/canvas_creation.js";
import { GameOptions } from "../game/settings/GameSettings.js";
import { DataMessage, Status } from "../game/types_transfert.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { randomInt } from "../utils/numbers.js";

declare const API_URL: string; // just telling the compiler that API_URL and WS_URL will exists during execution
declare const WS_URL: string;

interface ServerRes {
	success: boolean;
	message: string;
}

//////////////////////////////////////////
//			API requests				//
//////////////////////////////////////////

async function printReplyInDiv(reply: Response, targetDivId: string): Promise<void> {
	try {
		const result: ServerRes = await reply.json();
		const message = result.message || "Unknown response";
		const container = getSafeElement(targetDivId, HTMLElement);
		container.innerHTML = `<p>${message}</p>`;
	} catch (err) {
		console.error("Caught error:", err);
	}
}

function createPostRequest(content: string): RequestInit {
	return {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: content,
		credentials: "include" // necessary for cookies to work
	};
}

function createFileRequest(file: FormData): RequestInit {
	return {
		method: "POST",
		body: file,
		credentials: "include" // necessary for cookies to work
	};
}

function createGetRequest(): RequestInit {
	return {
		method: "GET",
		credentials: "include" // necessary for cookies to work
	};
}

async function sendPostRequestToBack(endpoint: string, content: string) : Promise<Response> {
	return await fetch(`${API_URL}/${endpoint}`, createPostRequest(content));
}

async function sendFile(file: FormData) : Promise<Response> {
	return await fetch(`${API_URL}/api/user/change_picture`, createFileRequest(file));
}

async function sendGetRequestToBack(endpoint: string) : Promise<Response> {
	return await fetch(`${API_URL}/${endpoint}`, createGetRequest());
}

async function getMessage(reply: Response): Promise<string> {
	try {
		const message: ServerRes = await reply.json();
		return message.message;
	} catch (err) {
		console.error("Invalid message received :", err);
	}
	return "";
}

//////////////////////////////////////////
//			Game management				//
//////////////////////////////////////////

async function askForGame(): Promise<boolean> {
	try {
		const reply = await sendGetRequestToBack("/api/game/ranked_game");
		const result: ServerRes = await reply.json();
		if (result.success) {
			return true;
		} else {
			console.log("Error:", result.message);
			return false;
		}
	} catch (err) {
		console.error("Caught error:", err);
		return false;
	}
}

async function waitForGame(): Promise<number | null> {
	let id = -1;
	try {
		while (id < 0) {
			const reply = await sendGetRequestToBack("/api/game/waiting");
			const result: ServerRes = await reply.json();
			if (result.success)
				id = Number(result.message);
			if (result.message === "stop")
				break;
		}
	} catch (err) {
		console.error("Caught error:", err);
		return null;
	}
	if (id >= 0)
		return id;
	console.log("No game found");
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
		map: "default",
		ball: "default",
		rotatingPlayer: true,
		spin: true,
		windAffectsBall: true
	};

	const reply = await sendPostRequestToBack("/api/game/ai_game", JSON.stringify(options));
	let id = -1;
	try {
		const result: ServerRes = await reply.json();
		if (result.success)
			id = Number(result.message);
		else
			console.log("Error:", result.message);
	} catch (err) {
		console.error("Caught error:", err);
		return;
	}
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
			case (Status.OBJECT): /** @todo remove after object refacto */
				updateGameObject(message);
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
		map: "default",
		ball: "default",
		rotatingPlayer: true,
		spin: true,
		windAffectsBall: true
	};

	const reply = await sendPostRequestToBack("/api/game/local_game", JSON.stringify(options));
	let id = -1;
	try {
		const result: ServerRes = await reply.json();
		if (result.success)
			id = Number(result.message);
		else
			console.log("Error:", result.message);
	} catch (err) {
		console.error("Caught error:", err);
		return;
	}
	if (id < 0) {
		console.log("Negative ID");
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
			case (Status.OBJECT): /** @todo remove after object refacto */
				updateGameObject(message);
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

export { getMessage, sendPostRequestToBack, sendGetRequestToBack, sendFile, printReplyInDiv, newRankedGame, newLocalGame, newGameVsAI };
