import { getSafeElement } from "../utils/getSafeElement.js";

declare const API_URL: string; // just telling the compiler that API_URL will exists during execution
declare const WS_URL: string;

interface ServerRes {
	success: boolean;
	message: string;
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

async function sendPostRequestToBack(endpoint: string, content: string, targetDivId: string) : Promise<void> {
	
	try {
		const reply = await fetch(`${API_URL}/${endpoint}`, createPostRequest(content));

		const result: ServerRes = await reply.json();
		const message = result.message || "Unknown response";
		const container = getSafeElement(targetDivId, HTMLElement);
		container.innerHTML = `<p>${message}</p>`;
	} catch (err) {
		console.error("Caught error:", err);
	}
}

async function sendGetRequestToBack(endpoint: string, targetDivId: string) : Promise<void> {
	
	try {
		const reply = await fetch(`${API_URL}/${endpoint}`, createGetRequest());

		const result: ServerRes = await reply.json();
		const message = result.message || "Unknown response";
		const container = getSafeElement(targetDivId, HTMLElement);
		container.innerHTML = `<p>${message}</p>`;
	} catch (err) {
		console.error("Caught error:", err);
	}
}

async function openWebSocketConnection(): Promise<void> {

	const ws = new WebSocket(`${WS_URL}`);

	ws.onopen = (): void => {
		console.log("Connected");
		ws.send("test message");
	};

	ws.onmessage = (event): void => {
		console.log("Received:", event.data);
		// ws.close();
	};

	ws.onerror = (err): void => {
		console.error("WebSocket error:", err);
	};

	ws.onclose = (event): void => {
		console.log("Closed:", event.code, event.reason);
	};
}

export { sendPostRequestToBack, sendGetRequestToBack, openWebSocketConnection };