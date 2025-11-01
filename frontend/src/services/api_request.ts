import { getSafeElement } from "../utils/getSafeElement.js";

declare const API_URL: string; // just telling the compiler that API_URL will exists during execution

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

async function sendRequestToBack(endpoint: string, content: string, targetDivId: string) : Promise<void> {
	
	try {
		const reply = await fetch(`${API_URL}/${endpoint}`, createPostRequest(content));

		const result: ServerRes = await reply.json();
		const message = result.message || "Unknown response";
		const container = getSafeElement(targetDivId);
		container.innerHTML = `<p>${message}</p>`;
	} catch (err) {
		console.error("Caught error:", err);
	}
}

export { sendRequestToBack };