import { FastifyRequest, FastifyReply } from "fastify";
import { hashString } from "../utils/hash_string.js";
import { sendReply } from "../utils/HTTP.js";
import { doesUserExist, insertUser } from "../database/user.js";

interface NewUserBody {
	username: string;
	pseudo: string;
	password: string;
}

async function addNewUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	const { username, pseudo, password } = req.body;
	if (await doesUserExist(username)) {
		sendReply(reply, 400, "username already taken");  /**@todo use translate tool */
		return;
	}
	await insertUser(username, pseudo, hashString(password));  /**@todo use translate tool */
	sendReply(reply, 201, "User created");
}

export { addNewUser };
