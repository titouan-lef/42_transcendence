import { FastifyRequest, FastifyReply } from "fastify";
import path from "path";
import fs from "fs";
import util from 'util';
import { pipeline } from 'stream';
import { sendReply } from "../utils/HTTP.js";
import { isValidPassword } from "../utils/hash_string.js";
import { getUserPassword, is2FAEnabled, updateTheme } from "../database/user.js";
import { request2FA } from "../security/2FA.js";
import { addAuthCookies, removeAuthCookies } from "../security/JWT.js";
import { wait } from "../utils/time.js";
import { Errors, Success } from "#shared/status_codes.js";
import { NewUserBody, ThemeBody } from "#shared/HTTP.js";

const PUMP = util.promisify(pipeline);

const ALLOWED_EXTENTIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

async function connectUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	const { username, password } = req.body;

	const hashPassword: string = await getUserPassword(username);

	if (!isValidPassword(password, hashPassword)) {
		await wait(1000); // wait 1 sec against brutforce
		sendReply(reply, Errors.WRONG_CREDENTIALS);
		return;
	}
	if (await is2FAEnabled(username)) {
		request2FA(username);
		sendReply(reply, Errors.TWOFA_REQUIRED);
		return;
	}
	addAuthCookies(reply, username);
	sendReply(reply, Success.LOOGED_IN);
}

async function disconnectUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	removeAuthCookies(reply);
	sendReply(reply, Success.LOOGED_OUT);
}

async function changePicture(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const part = await req.file();
	if (!part) {
		sendReply(reply, Errors.NO_FILE_GIVEN);
		return;
	}
	const extention = path.extname(part.filename).toLowerCase();
	if (!ALLOWED_EXTENTIONS.includes(extention)) {
		sendReply(reply, Errors.INVALID_FILE_TYPE);
		return;
	}
	const fullPath = `/app/backups/pictures/${user}`;
	await PUMP(part.file, fs.createWriteStream(fullPath));
	sendReply(reply, Success.AVATAR_UPDATED);
}

async function changeTheme(req: FastifyRequest<{ Body:ThemeBody }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const theme = req.body?.theme;
	if (theme === undefined) {
		sendReply(reply, Errors.NO_THEME_GIVEN);
		return;
	}
	await updateTheme(user, theme);
	sendReply(reply, Success.USER_UPDATED);
}

export { connectUser, disconnectUser, changePicture, changeTheme };
