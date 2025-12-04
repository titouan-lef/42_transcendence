import { FastifyRequest, FastifyReply } from "fastify";
import { addFriendship, getFriendships, isFriendWith, removeFriendship } from "./database/friendship.js";
import { sendReply } from "./utils/HTTP.js";
import { doesUserExist, User } from "./database/user.js";
import { UserBody } from "./user_management/connect_user.js";

async function getFriendList(req: FastifyRequest<{ "Body": UserBody }>, reply: FastifyReply): Promise<void> {
	const user = req.body?.user;
	if(!user) {
		sendReply(reply, 400, true, "No friend given");
		return;
	}
	if (!await doesUserExist(user)) {
		sendReply(reply, 400, true, "No such user");
		return;
	}
	const list = await getFriendships(user);
	sendReply(reply, 200, true, JSON.stringify(list));
}

async function newFriend(req: FastifyRequest<{ "Body": UserBody }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user) {
		sendReply(reply, 401, false, "You are not connected");
		return;
	}
	const friend = req.body?.user;
	if(!friend) {
		sendReply(reply, 400, false, "No friend given");
		return;
	}
	if (user === friend) {
		sendReply(reply, 400, false, `You cannot add yourself as a friend`);
		return;
	}
	if (!await doesUserExist(friend)) {
		sendReply(reply, 404, false, "No such user");
		return;
	}
	if (await isFriendWith(user, friend)) {
		sendReply(reply, 400, false, `${friend} is already in your you friend list`);
		return;
	}
	addFriendship(user, friend);
	sendReply(reply, 200, true, `${friend} added to you friend list`);
}

async function removeFriend(req: FastifyRequest<{ "Body": UserBody }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user) {
		sendReply(reply, 401, false, "You are not connected");
		return;
	}
	const friend = req.body?.user;
	if(!friend) {
		sendReply(reply, 400, false, "No friend given");
		return;
	}
	if (!await doesUserExist(friend)) {
		sendReply(reply, 404, false, "No such user");
		return;
	}
	if (!await isFriendWith(user, friend)) {
		sendReply(reply, 400, false, `${friend} is not your friend`);
		return;
	}
	removeFriendship(user, friend);
	sendReply(reply, 200, true, `${friend} removed to you friend list`);
}

export { getFriendList, newFriend, removeFriend };
