import { newGame } from "../game/canvas_creation.js";
import { BallOption, MapOption } from "../game/settings/GameSettings.js";
import { DataMessage, Status } from "../game/types_transfert.js";
import { getSafeElement } from "../utils/getSafeElement.js";

declare const API_URL: string; // just telling the compiler that API_URL and WS_URL will exists during execution
declare const WS_URL: string;

//////////////////////////////////////////
//			API requests				//
//////////////////////////////////////////

async function printReplyInDiv(reply: Response, targetDivId: string): Promise<void> {
	const message = await getReplyMessage(reply);
	const container = getSafeElement(targetDivId, HTMLElement);
	container.innerHTML = `<p>${message}</p>`;
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

function isRequestSuccessfull(reply: Response): boolean {
	return reply.status >= 200 && reply.status < 300;
}

async function getReplyMessage(reply: Response): Promise<string> {
	try {
		const message: string = await reply.text();
		return message;
	} catch (err) {
		console.error("Invalid reply:", err);
	}
	return "";
}

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
	const reply = await sendGetRequestToBack("/api/game/ranked_game");
	if (!isRequestSuccessfull(reply)) {
		console.log("Error:", getReplyMessage(reply));
		return false;
	}
	return true;
}

async function waitForGame(): Promise<number | null> {
	let id = -1;
	let reply: Response;
	do {
		reply = await sendGetRequestToBack("/api/game/waiting");
		if (isRequestSuccessfull(reply))
			id = Number(await getReplyMessage(reply));
	} while (id < 0 && reply.status !== 404);
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
	const message = await getReplyMessage(reply);
	if (!isRequestSuccessfull(reply)) {
		console.log("Error:", message);
		return;
	}
	const id = Number(message);
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
	const message = await getReplyMessage(reply);
	if (!isRequestSuccessfull(reply)) {
		console.log("Error:", message);
		return;
	}
	const id = Number(message);
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

export { getReplyMessage, sendPostRequestToBack, sendGetRequestToBack, sendFile, printReplyInDiv, newRankedGame, newLocalGame, newGameVsAI };
