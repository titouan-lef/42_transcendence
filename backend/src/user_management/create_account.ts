import { FastifyRequest, FastifyReply } from "fastify";
import { hashString } from "../utils/hash_string.js";
import { sendReply } from "../utils/HTTP.js";
import { doesUserExist, getUserByUsername, insertUser, updateEmail, updatePassword, updatePseudo } from "../database/user.js";

interface NewUserBody {
	username: string;
	pseudo: string;
	password: string;
}

interface UpdateUserBody {
	pseudo: string;
	password: string;
	email: string;
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

async function updateUserInfos(req: FastifyRequest<{ "Body": UpdateUserBody }>, reply: FastifyReply): Promise<void> {
	const username = req.user;
	if (!username)
		return;

	const user = await getUserByUsername(username);
	if (!user)
		return;

	let status = '';
	const { pseudo, password, email } = req.body;

	if (pseudo && (pseudo !== user.pseudo)) {
		await updatePseudo(username, pseudo);
		status += 'Pseudo';
	}
	if (password && (hashString(password) !== user.hashedPassword)) {
		await updatePassword(username, hashString(password));
		if (status)
			status += ', ';
		status += 'Password';
	}
	if (email && (email !== user.email)) {
		await updateEmail(username, email);
		if (status)
			status += ', ';
		status += 'Email';
	}
	if (!status) {
		sendReply(reply, 400, "No data to update");
		return;
	}

	sendReply(reply, 201, status + " updated");
	/** @todo translation ;) */
}

export { UpdateUserBody, addNewUser, updateUserInfos };
