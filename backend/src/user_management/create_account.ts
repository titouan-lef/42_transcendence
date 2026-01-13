import { FastifyRequest, FastifyReply } from "fastify";
import { hashString, isValidPassword } from "../utils/hash_string.js";
import { sendReply } from "../utils/HTTP.js";
import { doesUserExist, getUserByUsername, insertUser, is2FAEnabled, updateEmail, updatePassword, updatePseudo } from "../database/user.js";
import { request2FA } from "../security/2FA.js";
import { Errors, Success } from "#shared/status_codes.js";
import { NewUserBody } from "#shared/HTTP.js";

interface UpdateUserBody {
	nickname: string;
	password: string;
	email: string;
}

const NB_CHAR_MAX = 10;

function isValidName(username: string): boolean {
	return (
		!/[\r\n]/.test(username) &&		// prevent CR/LF injection
		!/\\s/.test(username) &&		// no whitespaces
		/^(?!\d+$).+$/.test(username)	// not only numbers
	);
}

function isTooLongName(username: string): boolean {
	return username.length > NB_CHAR_MAX;	// max 10 characters
}

async function addNewUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	const { username, nickname, password } = req.body;
	if (!isValidName(username)) {
		sendReply(reply, Errors.INVALID_USERNAME);
		return;
	}
	if (isTooLongName(username)) {
		sendReply(reply, Errors.TOO_LONG_USERNAME);
		return;
	}
	if (!isValidName(nickname)) {
		sendReply(reply, Errors.INVALID_NICKNAME);
		return;
	}
	if (isTooLongName(nickname)) {
		sendReply(reply, Errors.TOO_LONG_NICKNAME);
		return;
	}
	if (await doesUserExist(username)) {
		sendReply(reply, Errors.USERNAME_TAKEN);
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
		if (isTooLongName(nickname)) {
			sendReply(reply, Errors.TOO_LONG_NICKNAME);
			return;
		}
		await updatePseudo(username, nickname);
		userModified = true;
	}
	if (password && !isValidPassword(password, user.hashedPassword)) {
		await updatePassword(username, hashString(password));
		userModified = true;
	}
	if (!email && user.email) {
		if (await is2FAEnabled(username)) {
			sendReply(reply, Errors.DISABLE_2FA);
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
