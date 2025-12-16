import { FastifyRequest, FastifyReply } from "fastify";
import { hashString, isValidPassword } from "../utils/hash_string.js";
import { sendReply } from "../utils/HTTP.js";
import { doesUserExist, getUserByUsername, insertUser, is2FAEnabled, updateEmail, updatePassword, updatePseudo } from "../database/user.js";
import { request2FA } from "../security/2FA.js";
import { Errors, Success } from "../utils/status_codes.js";

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
		sendReply(reply, Errors.USERNAME_TAKEN); /**@todo use translate tool */
		return;
	}
	await insertUser(username, pseudo, hashString(password));  /**@todo use translate tool */
	sendReply(reply, Success.USER_CREATED);
}

async function updateUserInfos(req: FastifyRequest<{ "Body": UpdateUserBody }>, reply: FastifyReply): Promise<void> {
	const username = req.user;
	if (!username)
		return;

	const user = await getUserByUsername(username);
	if (!user)
		return;

	let userModified = false;
	const { pseudo, password, email } = req.body;

	if (pseudo && (pseudo !== user.pseudo)) {
		await updatePseudo(username, pseudo);
		userModified = true;
	}
	if (password && !isValidPassword(password, user.hashedPassword)) {
		await updatePassword(username, hashString(password));
		userModified = true;
	}
	if (!email && user.email) {
		if (await is2FAEnabled(username)) {
			sendReply(reply, 400, "Please desactivate 2FA before clearing your email");
			return;
		}
		await updateEmail(username, email);
		userModified = true;
	} else if (email && (email !== user.email)) {
		const emailSent = await request2FA(username, email);
		if (!emailSent) {
			sendReply(reply, Errors.INVALID_EMAIL);
			return;
		}
		sendReply(reply, Errors.TWOFA_REQUIRED);
		return;
	}
	if (!userModified) {
		sendReply(reply, Errors.NO_DATA_TO_UPDATE);
		return;
	}

	sendReply(reply, Success.USER_UPDATED);
}

export { UpdateUserBody, addNewUser, updateUserInfos };
