import { translateTab } from "../lang/lang.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { Errors, ReplyStatus } from '#shared/status_codes';
import { REPLY_MESSAGES } from "./reply_messages.js";

interface ReplyFromBack {
	code: ReplyStatus
	content: string
}

/**
 * Inside a try/catch in case the div is not more present in the page
 */
async function printReplyInDiv(reply: ReplyFromBack, targetDivId: string): Promise<void> {
	try {
		const message = getReplyMessage(reply);
		const container = getSafeElement(targetDivId, HTMLElement);
		container.innerHTML = `<p>${message}</p>`;
	} catch {};
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

async function structureReply(reply: Response | null): Promise<ReplyFromBack> {
	let replyFromBack: ReplyFromBack = {
		code: Errors.REQUEST_FAILED,
		content: ''
	};
	if (!reply)
		return replyFromBack;
	try {
		const raw = await reply.text();
		replyFromBack = JSON.parse(raw);
	} catch {}
	return replyFromBack;
}

async function sendPostRequestToBack(endpoint: string, content: string) : Promise<ReplyFromBack> {
	let reply: Response | null = null;
	try {
		reply = await fetch(endpoint, createPostRequest(content));
	} catch {}
	return structureReply(reply);
}

async function sendFile(file: FormData) : Promise<ReplyFromBack> {
	const f = file.get("picture");
	if (f instanceof File && f.size > 2 * 1024 * 1024) { // 2 Mo
		return {
			code: Errors.FILE_TOO_BIG,
			content: ''
		};
	}

	let reply: Response | null = null;
	try {
		reply = await fetch(`/api/user/change_picture`, createFileRequest(file));
	} catch {}
	return structureReply(reply);
}

async function sendGetRequestToBack(endpoint: string) : Promise<ReplyFromBack> {
	let reply: Response | null = null;
	try {
		reply = await fetch(endpoint, createGetRequest());
	} catch {}
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
