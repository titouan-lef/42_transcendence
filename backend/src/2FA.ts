import nodemailer from "nodemailer";
import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { randomInt } from "./utils/math.js";
import { sendReply } from "./utils/HTTP.js";
import { COOKIES_OPTIONS, SECRET } from "./user_management/connect_user.js";
import { disabled2FA, enabled2FA, is2FAEnabled, isEmailDefined } from "./database/user.js";

/** https://dev.to/veektor_v/send-emails-using-nodemailer-typescript-4763 */

const EMAIL = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: "transcendence.pong.donotreply@gmail.com", /** @todo .env */
		pass: "ylhjlempohhylssv", /** @todo .env */
	},
});

const CODES = new Map<string, number>();

function sendEmailCode(email: string, code: number): void {
	EMAIL.sendMail({
		from: "transcendence.pong.donotreply@gmail.com", /** @todo .env */
		to: email,
		subject: "Your 2FA Code",
		text: `Your verification code is: ${code}`,
	});
}

function request2FA(user: string): void {
	const code = randomInt(1000, 9999);
	const email = "lucienguerbigny@gmail.com"; /** @todo getEmail(id) */
	sendEmailCode(email, code);
	if (CODES.has(user))
		CODES.delete(user);
	CODES.set(user, code);
}

interface Content2FA {
	user: string;
	code: number;
};

async function verify2FA(req: FastifyRequest<{ "Body": Content2FA }>, reply: FastifyReply): Promise<void> {
	const { user, code } = req.body;
	if (!user)
		return; /** @todo sendReply ?? */
	if (Number(code) !== CODES.get(user)) {
		sendReply(reply, 400, "Invalid code"); /** @todo use translate tool */
		return;
	}
	CODES.delete(user);
	const token = jwt.sign({ user }, SECRET);
	reply.setCookie("token", token, COOKIES_OPTIONS);
	sendReply(reply, 200, "Successfuly loged in"); /** @todo use translate tool */
}

async function activate2FA(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return; /** @todo sendReply ?? */
	if (await is2FAEnabled(user)) {
		sendReply(reply, 400, "Already activated"); /** @todo use translate tool */
		return;
	}
	if (!await isEmailDefined(user)) {
		sendReply(reply, 400, "Please define you email first"); /** @todo use translate tool */
		return;
	}
	enabled2FA(user);
	sendReply(reply, 200, "2FA activated successfuly"); /** @todo use translate tool */
}

async function desactivate2FA(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return; /** @todo sendReply ?? */
	if (!await is2FAEnabled(user)) {
		sendReply(reply, 400, "Already disabled"); /** @todo use translate tool */
		return;
	}
	disabled2FA(user);
	sendReply(reply, 200, "Successfuly loged in"); /** @todo use translate tool */
}

export { request2FA, verify2FA, activate2FA, desactivate2FA };