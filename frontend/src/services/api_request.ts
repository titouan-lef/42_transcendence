import { translateTab } from "../lang/lang.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { Errors, ReplyStatus } from '#shared/status_codes';
import { REPLY_MESSAGES } from "./reply_messages.js";

declare const API_URL: string; // just telling the compiler that API_URL and WS_URL will exists during execution

interface ReplyFromBack {
	code: ReplyStatus
	content: string
}

async function printReplyInDiv(reply: ReplyFromBack, targetDivId: string): Promise<void> {
	const message = getReplyMessage(reply);
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

async function structureReply(reply: Response): Promise<ReplyFromBack> {
	let replyFromBack: ReplyFromBack;
	try {
		const raw = await reply.text();
		replyFromBack = JSON.parse(raw);
	} catch (err) {
		console.error("Invalid reply:", err); /** @todo remove */
		replyFromBack = {
			code: Errors.REQUEST_FAILED,
			content: ''
		};
	}
	return replyFromBack;
}

async function sendPostRequestToBack(endpoint: string, content: string) : Promise<ReplyFromBack> {
	const reply = await fetch(endpoint, createPostRequest(content));
	return structureReply(reply);
}

async function sendFile(file: FormData) : Promise<ReplyFromBack> {
	const reply = await fetch(`/api/user/change_picture`, createFileRequest(file));
	return structureReply(reply);
}

async function sendGetRequestToBack(endpoint: string) : Promise<ReplyFromBack> {
	const reply = await fetch(endpoint, createGetRequest());
	return structureReply(reply);
}

function isRequestSuccessfull(reply: ReplyFromBack): boolean {
	return reply.code < 200;
}

function getReplyMessage(reply: ReplyFromBack): string {
	if (!(reply.code in REPLY_MESSAGES))
		return "";
	const message = REPLY_MESSAGES[reply.code];
	if (!message)
		return "";
	const traductions = translateTab([message]);
	return traductions.join(" ");
}

export { ReplyFromBack, getReplyMessage, sendPostRequestToBack, sendGetRequestToBack, sendFile, printReplyInDiv, isRequestSuccessfull };
