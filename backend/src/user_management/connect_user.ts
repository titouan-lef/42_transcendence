import { FastifyRequest, FastifyReply } from "fastify";
import { findUserPassword } from "../database/find_data.js";
import { CookieSerializeOptions } from '@fastify/cookie';
import jwt, { JwtPayload } from "jsonwebtoken";

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

	const realPassword: string = await findUserPassword(id);

	/** @todo hash the password */
	if (realPassword !== password) {
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
	authenticate(req, reply);
	reply.code(200).send({ success: true, message: req.user });
}

function authenticate(req: FastifyRequest, reply: FastifyReply): void {
	const token = req.cookies?.token;
	if (!token) {
		reply.code(201).send({ success: false, message: "Not logged in" });
		return;
	}

	try {
		const payload = jwt.verify(token, SECRET);
		// eslint-disable-next-line
		req.user = (payload as JwtPayload).id; // payload will always be this format because it's how it is created.
	} catch {
		reply.code(201).send({ success: false, message: "Invalid token" });
	}
}

export { connectUser, disconnectUser, whoami, authenticate };
