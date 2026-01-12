import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { CookieSerializeOptions } from '@fastify/cookie';
import { sendReply } from "../utils/HTTP.js";
import { doesUserExist } from "../database/user.js";
import { Errors } from "#shared/status_codes.js";
import { GUEST_NAME } from "#shared/constant.js";

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
		guestId?: number;
	}
}

interface UserIdentity {
	username: string,
	guestId: number,
}

let nbGuestUsers = 0;

function createToken(username: string): string {
	let id = 0;
	if (username === GUEST_NAME) {
		nbGuestUsers += 1;
		id = nbGuestUsers;
	}
	const data: UserIdentity = {
		username: username,
		guestId: id
	};
	return jwt.sign(data, SECRET);
}

function addAuthCookies(reply: FastifyReply, user: string): void {
	const token = createToken(user);
	reply.setCookie("token", token, COOKIES_OPTIONS);
}

function removeAuthCookies(reply: FastifyReply): void {
	reply.clearCookie("token", COOKIES_OPTIONS);
}

function identifyUser(token: string): UserIdentity {
	// eslint-disable-next-line
	const payload: UserIdentity = jwt.verify(token, SECRET) as UserIdentity; // payload will always be this format because it's how it is created.
	if (payload.username === GUEST_NAME && payload.guestId > nbGuestUsers)
		throw new Error("Too old guest token, needs to reconnect");
	return payload;
}

async function verifyAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const token = req.cookies?.token;
	if (!token)
		return sendReply(reply, Errors.AUTH_REQUIRED);
	try {
		const user = identifyUser(token);
		const exists = await doesUserExist(user.username);
		if (!exists) {
			removeAuthCookies(reply);
			return sendReply(reply, Errors.NO_SUCH_USER);
		}
		req.user = user.username;
		if (user.username === GUEST_NAME)
			req.guestId = user.guestId;
	} catch {
		removeAuthCookies(reply);
		return sendReply(reply, Errors.INVALID_TOKEN);
	}
}

async function rejectGuest(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const username = req.user;
	if (username === GUEST_NAME)
		sendReply(reply, Errors.AUTH_REQUIRED);
}

export { UserIdentity, addAuthCookies, removeAuthCookies, verifyAuth, identifyUser, rejectGuest };
