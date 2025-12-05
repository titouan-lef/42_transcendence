import { FastifyRequest, FastifyReply } from "fastify";
import { CookieSerializeOptions } from '@fastify/cookie';
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendReply } from "../utils/HTTP.js";
import { isValidPassword } from "../utils/hash_string.js";
import { changeUserPicture, doesUserExist, getUserPassword, getUserPicture } from "../database/user.js";
import fs from 'fs';
import util from 'util';
import { pipeline } from 'stream';

const PUMP = util.promisify(pipeline);

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

interface NewUserBody {
	id: string;
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
	const { id, password } = req.body;

	const hashPassword: string = await getUserPassword(id);

	if (!isValidPassword(password, hashPassword)) {
		sendReply(reply, 400, "Wrong id or password");
		return;
	}
	const token = jwt.sign({ id }, SECRET);
	reply.setCookie("token", token, COOKIES_OPTIONS);
	sendReply(reply, 200, "Successfuly loged in");
}

async function disconnectUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	reply.clearCookie("token", COOKIES_OPTIONS);
	sendReply(reply, 200, "Logged out");
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

async function changePicture(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const part = await req.file();
	if (!part)
		return;
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
		return sendReply(reply, 401, "Not logged in");

	try {
		// eslint-disable-next-line
		const payload: JwtPayload = jwt.verify(token, SECRET) as JwtPayload; // payload will always be this format because it's how it is created.
		const exists = await doesUserExist(payload.id);
		if (!exists) {
			reply.clearCookie("token", COOKIES_OPTIONS);
			return sendReply(reply, 401, "User does not exist");
		}
		req.user = payload.id;
	} catch {
		reply.clearCookie("token", COOKIES_OPTIONS);
		return sendReply(reply, 201, "Invalid token");
	}
}

export { UserBody, connectUser, disconnectUser, whoami, getPicture, changePicture, verifyAuth, SECRET };
