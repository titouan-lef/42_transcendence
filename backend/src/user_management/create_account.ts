import { FastifyRequest, FastifyReply } from "fastify";
import { hashString, isValidHashedPassword } from "../utils/hash_string.js";
import { sendReply } from "../utils/HTTP.js";
import { doesUserExist, getUserByUsername, insertUser, is2FAEnabled, updateEmail, updatePassword, updatePseudo } from "../database/user.js";
import { request2FA } from "../security/2FA.js";
import { Errors, Success } from "#shared/status_codes.js";
import { NewUserBody } from "#shared/HTTP.js";
import { isValidEmail, isValidName, isValidPassword } from "#shared/verifications.js";

interface UpdateUserBody {
	nickname: string;
	password: string;
	email: string;
}

async function addNewUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	const { username, nickname, password } = req.body;
	if (!isValidName(username)) {
		sendReply(reply, Errors.INVALID_USERNAME);
		return;
	}
	if (!isValidName(nickname)) {
		sendReply(reply, Errors.INVALID_NICKNAME);
		return;
	}
	if (await doesUserExist(username)) {
		sendReply(reply, Errors.USERNAME_TAKEN);
		return;
	}
	if (!isValidPassword(password)) {
		sendReply(reply, Errors.INVALID_PASSWORD);
		return;
	}
	await insertUser(username, nickname, hashString(password));
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
	const { nickname, password, email } = req.body;

	if (nickname && (nickname !== user.nickname)) {
		if (!isValidName(nickname)) {
			sendReply(reply, Errors.INVALID_NICKNAME);
			return;
		}
		await updatePseudo(username, nickname);
		userModified = true;
	}
	if (password && !isValidHashedPassword(password, user.hashedPassword)) {
		await updatePassword(username, hashString(password));
		userModified = true;
	}
	if (!email && user.email) {
		if (await is2FAEnabled(username)) {
			sendReply(reply, Errors.DISABLE_2FA);
			return;
		}
		if (!isValidEmail(email)) {
			sendReply(reply, Errors.INVALID_EMAIL);
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

export { UpdateUserBody, addNewUser, updateUserInfos, isValidName };
