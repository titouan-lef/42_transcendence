import { FastifyReply } from "fastify";

async function sendReply(reply: FastifyReply, code: number, successStatus: boolean, messageContent?: string): Promise<void> {
	return reply.code(code).send({ success: successStatus, message: messageContent });
}

export { sendReply };