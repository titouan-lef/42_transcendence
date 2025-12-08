import { FastifyReply } from "fastify";

async function sendReply(reply: FastifyReply, code: number, messageContent?: string): Promise<void> {
	return reply.code(code).send(messageContent);
}

export { sendReply };
