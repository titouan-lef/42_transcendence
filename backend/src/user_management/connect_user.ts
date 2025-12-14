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
		sendReply(reply, 400, "Wrong id or password"); /**@todo use translate tool */
		return;
	}
	if (await is2FAEnabled(user)) {
		request2FA(user);
		sendReply(reply, 401, "2FA required");
		return;
	}
	addAuthCookies(reply, user);
	sendReply(reply, 200, "Successfuly loged in"); /**@todo use translate tool */
}

async function disconnectUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	removeAuthCookies(reply);
	sendReply(reply, 200, "Logged out"); /**@todo use translate tool */
}

interface UserBody {
	user?: string;
}

async function changePicture(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const part = await req.file();
	if (!part) {
		sendReply(reply, 400, "No file given");
		return;
	}
	const path = `/app/backups/pictures/${user}`;
	await PUMP(part.file, fs.createWriteStream(path));
	// await changeUserPicture(user, part.filename);
	sendReply(reply, 200, "Profile picture updated");
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
		sendReply(reply, 400, "No theme given");
		return;
	}
	await updateTheme(user, theme);
	sendReply(reply, 200, "Theme updated");
}

export { UserBody, ThemeBody, connectUser, disconnectUser, changePicture, changeTheme };
