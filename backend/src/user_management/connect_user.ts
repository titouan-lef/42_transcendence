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

const SECRET = "blablablou";
const COOKIES_OPTIONS: CookieSerializeOptions = {
	httpOnly: true,
	sameSite: "lax",	// or "none" if cross-site
	secure: false,		// must be true if you're using HTTPS
	path: "/",
};

export async function connectUser(req: FastifyRequest<{ Body: NewUserBody }>, reply: FastifyReply): Promise<void> {
	const { id, password } = req.body;

	const realPassword: string = await findUserPassword(id);

	/** @todo hash the password */
	if (realPassword === password) {
		const token = jwt.sign({id}, SECRET);
		reply
			.setCookie("token", token, COOKIES_OPTIONS) // httpOnly prevent js on client to read teh cookies and so protect again XSS attacks
			.code(201)
			.send({ success: true, message: "Successfuly loged in" });
	} else {
		reply.code(201).send({ success: false, message: "Wrong id or password" });
	}
}

export async function disconnectUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	reply
		.clearCookie("token", COOKIES_OPTIONS)
		.code(200)
		.send({ success: true, message: "Logged out" });
}

export async function whoami(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	authenticate(req, reply);
	reply.code(200).send({ success: true, message: req.user });
}

export function authenticate(req: FastifyRequest, reply: FastifyReply): void {
	const token = req.cookies?.token;
	if (!token) {
		reply.code(201).send({ success: false, message: "Not logged in" });
		return;
	}

	try {
		// eslint-disable-next-line
		const payload = jwt.verify(token, SECRET) as { id: string }; /** @todo: remove assertion if possible */
		req.user = payload.id;
	} catch {
		reply.code(201).send({ success: false, message: "Invalid token" });
	}
}
