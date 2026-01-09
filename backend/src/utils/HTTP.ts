import { FastifyReply } from "fastify";
import { ReplyStatus } from "#shared/status_codes.js";
import { ReplyFromBack } from "#shared/HTTP";

async function sendReply(reply: FastifyReply, statusCode: ReplyStatus, content?: string ): Promise<void> {
	const data: ReplyFromBack = {
		code: statusCode,
		content: content? content : ''
	};
	return reply.code(200).send(data);
}

export { sendReply };
