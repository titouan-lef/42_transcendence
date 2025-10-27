import { FastifyRequest, FastifyReply } from "fastify";
import { isValidUser, findUserPassword } from "../database/find_data.js";
import { CookieSerializeOptions } from '@fastify/cookie';
import jwt, { JwtPayload } from "jsonwebtoken";
import { isValidPassword } from "../utils/hashString.js";

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

interface NewUserBody {
	id: string;
	pseudo: string;
	password: string;
	ppLink: string;
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

	const hashPassword: string = await findUserPassword(id);

	if (!isValidPassword(password, hashPassword)) {
		reply.code(201).send({ success: false, message: "Wrong id or password" });
		return;
	}
	const token = jwt.sign({ id }, SECRET);
	reply
		.setCookie("token", token, COOKIES_OPTIONS)
		.code(201)
		.send({ success: true, message: "Successfuly loged in" });
}

async function disconnectUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	reply
		.clearCookie("token", COOKIES_OPTIONS)
		.code(200)
		.send({ success: true, message: "Logged out" });
}

async function whoami(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	reply.code(200).send({ success: true, message: req.user });
}

async function verifyAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const token = req.cookies?.token;
	if (!token) {
		return reply
			.code(201)
			.send({ success: false, message: "Not logged in" });
	}

	try {
		// eslint-disable-next-line
		const payload: JwtPayload = jwt.verify(token, SECRET) as JwtPayload; // payload will always be this format because it's how it is created.
		const exists = await isValidUser(payload.id);
		if (!exists) {
			return reply
				.clearCookie("token", COOKIES_OPTIONS)
				.code(401)
				.send({ success: false, message: "User does not exist" });
		}
		req.user = payload.id;
	} catch {
		return reply
			.clearCookie("token", COOKIES_OPTIONS)
			.code(201)
			.send({ success: false, message: "Invalid token" });
	}
}

export { connectUser, disconnectUser, whoami, verifyAuth };
