import { FastifyRequest, FastifyReply } from "fastify";
import { sendReply } from "../utils/HTTP.js";
import { isValidPassword } from "../utils/hash_string.js";
import { getUserPassword, is2FAEnabled, updateTheme } from "../database/user.js";
import fs from "fs";
import util from 'util';
import { pipeline } from 'stream';
import { request2FA } from "../security/2FA.js";
import { addAuthCookies, removeAuthCookies } from "../security/JWT.js";
import { wait } from "../utils/time.js";
import { Errors, Success } from "../utils/status_codes.js";

const PUMP = util.promisify(pipeline);

interface NewUserBody {
	user: string;
	pseudo: string;
	password: string;
}

async function connectUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	const { user, password } = req.body;

	const hashPassword: string = await getUserPassword(user);

	if (!isValidPassword(password, hashPassword)) {
		await wait(1000); // wait 1 sec against brutforce
		sendReply(reply, Errors.WRONG_CREDENTIALS);
		return;
	}
	if (await is2FAEnabled(user)) {
		request2FA(user);
		sendReply(reply, Errors.TWOFA_REQUIRED);
		return;
	}
	addAuthCookies(reply, user);
	sendReply(reply, Success.LOOGED_IN);
}

async function disconnectUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	removeAuthCookies(reply);
	sendReply(reply, Success.LOOGED_OUT);
}

interface UserBody {
	user?: string;
}

interface EmailBody {
	email: string;
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
	const path = `/app/backups/pictures/${user}`;
	await PUMP(part.file, fs.createWriteStream(path));
	sendReply(reply, Success.AVATAR_UPDATED);
}

interface ThemeBody {
	theme: string;
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

export { UserBody, ThemeBody, connectUser, disconnectUser, changePicture, changeTheme };
