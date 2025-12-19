import { FastifyRequest, FastifyReply } from "fastify";
import { addFriendship, getFriendships, isFriendWith, removeFriendship } from "../database/friendship.js";
import { sendReply } from "../utils/HTTP.js";
import { doesUserExist, User } from "../database/user.js";
import { UserBody } from "./connect_user.js";
import { Errors, Success } from "../../shared/status_codes.js";

async function getFriendList(req: FastifyRequest<{ "Body": UserBody }>, reply: FastifyReply): Promise<void> {
	const user = req.body?.user;
	if(!user) {
		sendReply(reply, Errors.NO_FRIEND_GIVEN);
		return;
	}
	if (!await doesUserExist(user)) {
		sendReply(reply, Errors.NO_SUCH_USER);
		return;
	}
	const list = await getFriendships(user);
	sendReply(reply, Success.FRIEND_LIST, JSON.stringify(list));
}

async function newFriend(req: FastifyRequest<{ "Body": UserBody }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const friend = req.body?.user;
	if(!friend) {
		sendReply(reply, Errors.NO_FRIEND_GIVEN);
		return;
	}
	if (user === friend) {
		sendReply(reply, Errors.FRIEND_HIMSELF);
		return;
	}
	if (!await doesUserExist(friend)) {
		sendReply(reply, Errors.NO_SUCH_USER);
		return;
	}
	if (await isFriendWith(user, friend)) {
		sendReply(reply, Errors.ALREADY_FRIEND_WITH );
		return;
	}
	addFriendship(user, friend);
	sendReply(reply, Success.FRIEND_ADDED);
}

async function removeFriend(req: FastifyRequest<{ "Body": UserBody }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const friend = req.body?.user;
	if(!friend) {
		sendReply(reply, Errors.NO_FRIEND_GIVEN);
		return;
	}
	if (!await doesUserExist(friend)) {
		sendReply(reply, Errors.NO_SUCH_USER);
		return;
	}
	if (!await isFriendWith(user, friend)) {
		sendReply(reply, Errors.NOT_FRIEND_WITH);
		return;
	}
	removeFriendship(user, friend);
	sendReply(reply, Success.FRIEND_REMOVED);
}

export { getFriendList, newFriend, removeFriend };
