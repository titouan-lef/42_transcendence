import { FastifyRequest, FastifyReply } from "fastify";
import { getFriendships } from "./database/friendship.js";
import { sendReply } from "./utils/HTTP.js";

interface FriendListBody {
	user: string;
};

async function getFriendList(req: FastifyRequest<{ "Body": FriendListBody }>, reply: FastifyReply): Promise<void> {
	const { user } = req.body;
	const list = await getFriendships(user);
	sendReply(reply, 200, true, JSON.stringify(list));
}

export { getFriendList };
