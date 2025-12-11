import { FastifyRequest, FastifyReply } from "fastify";
import { sendReply } from "../utils/HTTP.js";
import { isValidPassword } from "../utils/hash_string.js";
import { updateEmail, changeUserPicture, getUserPassword, getUserPicture, is2FAEnabled } from "../database/user.js";
import fs from 'fs';
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

async function getPicture(req: FastifyRequest<{ "Body": UserBody }>, reply: FastifyReply): Promise<void> {
	const user = req.body?.user;
	if(!user) {
		sendReply(reply, 400, "No user given");
		return;
	}
	const filename = await getUserPicture(user);
	if (!filename) {
		sendReply(reply, 204, "./images/avatar.png");
		return;
	}
	sendReply(reply, 200, filename);
}

interface EmailBody {
	email: string;
}

async function changeEmail(req: FastifyRequest<{ Body: EmailBody }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const email = req.body?.email;
	if (!email) {
		sendReply(reply, 400, "No email given");
		return;
	}
	await updateEmail(user, email);
	sendReply(reply, 200, "Email updated");
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
	const path = `/app/pictures/${part.filename}`;
	await PUMP(part.file, fs.createWriteStream(path));
	await changeUserPicture(user, part.filename);
	sendReply(reply, 200, "Profile picture updated");
}

export { UserBody, EmailBody, connectUser, disconnectUser, getPicture, changePicture, changeEmail };
