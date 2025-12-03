import { FastifyRequest, FastifyReply } from "fastify";
import { CookieSerializeOptions } from '@fastify/cookie';
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendReply } from "../utils/HTTP.js";
import { isValidPassword } from "../utils/hash_string.js";
import { doesUserExist, getUserPassword } from "../database/user.js";

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
		sendReply(reply, 400, false, "Wrong id or password");
		return;
	}
	const token = jwt.sign({ id }, SECRET);
	reply.setCookie("token", token, COOKIES_OPTIONS);
	sendReply(reply, 200, true, "Successfuly loged in");
}

async function disconnectUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	reply.clearCookie("token", COOKIES_OPTIONS);
	sendReply(reply, 200, true, "Logged out");
}

async function whoami(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	sendReply(reply, 200, true, req.user);
}

async function verifyAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const token = req.cookies?.token;
	if (!token)
		return sendReply(reply, 201, false, "Not logged in");

	try {
		// eslint-disable-next-line
		const payload: JwtPayload = jwt.verify(token, SECRET) as JwtPayload; // payload will always be this format because it's how it is created.
		const exists = await doesUserExist(payload.id);
		if (!exists) {
			reply.clearCookie("token", COOKIES_OPTIONS);
			return sendReply(reply, 401, false, "User does not exist");
		}
		req.user = payload.id;
	} catch {
		reply.clearCookie("token", COOKIES_OPTIONS);
		return sendReply(reply, 201, false, "Invalid token");
	}
}

export { connectUser, disconnectUser, whoami, verifyAuth, SECRET };
