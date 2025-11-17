import { showCanvas, updateGameObject } from "../game/canvas_creation.js";
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

async function openWebSocketConnection(): Promise<void> {

	const ws = new WebSocket(`${WS_URL}`);

	ws.onopen = (): void => {
		console.log("Connected");
	};

	ws.onmessage = (event): void => { /** @todo handeler for game */
		console.log("Received:", event.data);

		const message : DataMessage = JSON.parse(event.data);
		switch (message.status) {
			case (Status.OPTIONS):
				showCanvas(ws, message);
				break;
			case (Status.OBJECT): /** @todo remove after object refacto */
				updateGameObject(message);
				break;
			default:
				return ;
		}
	};

	ws.onerror = (err): void => {
		console.error("WebSocket error:", err);
	};

	ws.onclose = (event): void => {
		console.log("Closed:", event.code, event.reason);
	};
}

export { sendPostRequestToBack, sendGetRequestToBack, printReplyInDiv, openWebSocketConnection };