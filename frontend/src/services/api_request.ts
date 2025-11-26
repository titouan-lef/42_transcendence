import { newGame, updateGameObject } from "../game/canvas_creation.js";
import { DataMessage, Status } from "../game/types_transfert.js";
import { getSafeElement } from "../utils/getSafeElement.js";

declare const API_URL: string; // just telling the compiler that API_URL and WS_URL will exists during execution
declare const WS_URL: string;

interface ServerRes {
	success: boolean;
	message: string;
}

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

function createGetRequest(): RequestInit {
	return {
		method: "GET",
		credentials: "include" // necessary for cookies to work
	};
}

async function sendPostRequestToBack(endpoint: string, content: string) : Promise<Response> {
	return await fetch(`${API_URL}/${endpoint}`, createPostRequest(content));
}

async function sendGetRequestToBack(endpoint: string) : Promise<Response> {
	return await fetch(`${API_URL}/${endpoint}`, createGetRequest());
}

async function openWebSocketConnection(endpoint?: string): Promise<WebSocket> {
	if (endpoint)
		return new WebSocket(`${WS_URL}/${endpoint}`);
	return new WebSocket(`${WS_URL}`);
}

async function newGameSolo(ws: WebSocket): Promise<void> {
	ws.onopen = (): void => {
		console.log("Connected");
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

async function newRankedGame(): Promise<void> {
	const ws = await openWebSocketConnection("ranked");
	newGameSolo(ws);
}

async function newGameVsAI(): Promise<void> {
	const ws = await openWebSocketConnection("AI");
	newGameSolo(ws);
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function newLocalGame(): Promise<void> {

	const player1 = await openWebSocketConnection("local");
	const player2 = await openWebSocketConnection("local");

	const id = randomInt(0, 5000);

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

export { sendPostRequestToBack, sendGetRequestToBack, printReplyInDiv, newRankedGame, newLocalGame, newGameVsAI };
