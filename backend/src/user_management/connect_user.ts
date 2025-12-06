import { FastifyRequest, FastifyReply } from "fastify";
import { CookieSerializeOptions } from '@fastify/cookie';
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendReply } from "../utils/HTTP.js";
import { isValidPassword } from "../utils/hash_string.js";
import { changeUserEmail, changeUserPicture, doesUserExist, getUserPassword, getUserPicture, is2FAEnabled } from "../database/user.js";
import fs from 'fs';
import util from 'util';
import { pipeline } from 'stream';
import { request2FA } from "../2FA.js";

const PUMP = util.promisify(pipeline);

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

interface NewUserBody {
	user: string;
	pseudo: string;
	password: string;
}

const SECRET = "blablablou"; /** @todo: put in the .env file and import it from .env -> remove the literal from the readable code */
const COOKIES_OPTIONS: CookieSerializeOptions = {
	httpOnly: true,		// httpOnly prevent js on client to read teh cookies and so protect again XSS attacks
	sameSite: "lax",	// or "none" if cross-site
	secure: false,		// must be true if you're using HTTPS
	path: "/",
};

async function connectUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	const { user, password } = req.body;

	const hashPassword: string = await getUserPassword(user);

	if (!isValidPassword(password, hashPassword)) {
		/** @todo wait 1 sec to protect again brutforce */
		sendReply(reply, 400, "Wrong id or password"); /**@todo use translate tool */
		return;
	}
	if (await is2FAEnabled(user)) {
		request2FA(user);
		sendReply(reply, 401, "2FA required");
		return;
	}
	const token = jwt.sign({ user }, SECRET);
	reply.setCookie("token", token, COOKIES_OPTIONS);
	sendReply(reply, 200, "Successfuly loged in"); /**@todo use translate tool */
}

async function disconnectUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	reply.clearCookie("token", COOKIES_OPTIONS);
	sendReply(reply, 200, "Logged out"); /**@todo use translate tool */
}

async function whoami(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	sendReply(reply, 200, req.user);
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
		return; /** @todo sendReply ? */
	const email = req.body?.email;
	if (!email)
		return; /** @todo sendReply ? */
	await changeUserEmail(user, email);
	sendReply(reply, 200, "Email updated");
}

async function changePicture(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return; /** @todo sendReply ? */
	const part = await req.file();
	if (!part)
		return; /** @todo sendReply ? */
	const path = `/app/pictures/${part.filename}`;
	await PUMP(part.file, fs.createWriteStream(path));
	await changeUserPicture(user, part.filename);
	sendReply(reply, 200, "Profile picture updated");
}

interface UserBody {
	user?: string;
}

async function verifyAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const token = req.cookies?.token;
	if (!token)
		return sendReply(reply, 401, "Not logged in"); /**@todo use translate tool */

	try {
		// eslint-disable-next-line
		const payload: JwtPayload = jwt.verify(token, SECRET) as JwtPayload; // payload will always be this format because it's how it is created.
		const exists = await doesUserExist(payload.user);
		if (!exists) {
			reply.clearCookie("token", COOKIES_OPTIONS);
			return sendReply(reply, 401, "User does not exist"); /**@todo use translate tool */
		}
		req.user = payload.user;
	} catch {
		reply.clearCookie("token", COOKIES_OPTIONS);
		return sendReply(reply, 201, "Invalid token"); /**@todo use translate tool */
	}
}

export { UserBody, EmailBody, connectUser, disconnectUser, whoami, getPicture, changePicture, changeEmail, verifyAuth, SECRET, COOKIES_OPTIONS };
