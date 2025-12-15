import { FastifyReply } from "fastify";
import { ReplyStatus } from "./status_codes";

interface ReplyFromBack {
	code: ReplyStatus
	content: string
}

async function sendReply(reply: FastifyReply, statusCode: ReplyStatus, content?: string ): Promise<void> {
	const data: ReplyFromBack = {
		code: statusCode,
		content: content? content : ''
	};
	return reply.code(200).send(data);
}

export { sendReply };
