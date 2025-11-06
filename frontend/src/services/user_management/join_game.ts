import { openWebSocketConnection, sendPostRequestToBack } from "../api_request.js";

function delay(ms: number): Promise<void> {
	return new Promise( resolve => setTimeout(resolve, ms) );
}

async function joinGame(): Promise<void> {
	await openWebSocketConnection();
	await delay(50);
	await sendPostRequestToBack("api/game/join", "{}", "print-content");
}
 
export { joinGame };