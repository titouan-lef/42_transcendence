import { openWebSocketConnection } from "../api_request.js";

async function joinGame(): Promise<void> {
	await openWebSocketConnection();
	/** @todo if successfull launch the page game */
}

export { joinGame };
