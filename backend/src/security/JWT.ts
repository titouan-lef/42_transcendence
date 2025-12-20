import { FastifyRequest, FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CookieSerializeOptions } from '@fastify/cookie';
import { sendReply } from "../utils/HTTP.js";
import { doesUserExist } from "../database/user.js";
import { Errors } from "#shared/status_codes.js";

const SECRET = String(process.env.JWT_SECRET);
if (!SECRET)
	throw new Error("No JWT_SECRET in .env");

const COOKIES_OPTIONS: CookieSerializeOptions = {
	httpOnly: true,		// httpOnly prevent js on client to read teh cookies and so protect again XSS attacks
	sameSite: "lax",	// or "none" if cross-site
	secure: false,		// must be true if you're using HTTPS
	path: "/",
};

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

function createToken(user: string): string {
	return jwt.sign({ user }, SECRET);
}

function addAuthCookies(reply: FastifyReply, user: string): void {
	const token = createToken(user);
	reply.setCookie("token", token, COOKIES_OPTIONS);
}

function removeAuthCookies(reply: FastifyReply): void {
	reply.clearCookie("token", COOKIES_OPTIONS);
}

function identifyUser(token: string): string {
	// eslint-disable-next-line
	const payload: JwtPayload = jwt.verify(token, SECRET) as JwtPayload;  // payload will always be this format because it's how it is created.
	return payload.user;
}

async function verifyAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const token = req.cookies?.token;
	if (!token)
		return sendReply(reply, Errors.AUTH_REQUIRED);
	try {
		const user = identifyUser(token);
		const exists = await doesUserExist(user);
		if (!exists) {
			removeAuthCookies(reply);
			return sendReply(reply, Errors.NO_SUCH_USER);
		}
		req.user = user;
	} catch {
		removeAuthCookies(reply);
		return sendReply(reply, Errors.INVALID_TOKEN);
	}
}

export { addAuthCookies, removeAuthCookies, verifyAuth, identifyUser };
