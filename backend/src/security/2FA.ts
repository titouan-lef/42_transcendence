import nodemailer from "nodemailer";
import { FastifyRequest, FastifyReply } from "fastify";
import { randomInt } from "../utils/math.js";
import { sendReply } from "../utils/HTTP.js";
import { disabled2FA, enabled2FA, getUserEmail, is2FAEnabled, isEmailDefined } from "../database/user.js";
import { addAuthCookies } from "./JWT.js";
import { wait } from "../utils/time.js";
import { Errors, Success } from "../utils/status_codes.js";

/** https://dev.to/veektor_v/send-emails-using-nodemailer-typescript-4763 */

const EMAIL = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const CODES = new Map<string, number>();

function sendEmailCode(email: string, code: number): void {
	EMAIL.sendMail({
		from: process.env.EMAIL,
		to: email,
		subject: "Your 2FA Code",
		text: `Your verification code is: ${code}`,
	});
}

async function request2FA(user: string): Promise<void> {
	const code = randomInt(1000, 9999);
	const email = await getUserEmail(user);
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
	if (Number(code) !== CODES.get(user)) {
		wait(1000);  // wait 1 sec against brutforce
		sendReply(reply, Errors.INVALID_2FA_CODE);
		return;
	}
	CODES.delete(user);
	addAuthCookies(reply, user);
	sendReply(reply, Success.LOOGED_IN);
}

async function enable2FA(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	if (await is2FAEnabled(user)) {
		sendReply(reply, Errors.ALREADY_ENABLED);
		return;
	}
	if (!await isEmailDefined(user)) {
		sendReply(reply, Errors.EMAIL_REQUIRED);
		return;
	}
	await enabled2FA(user);
	sendReply(reply, Success.TWOWFA_ENABLED);
}

async function disable2FA(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	if (!await is2FAEnabled(user)) {
		sendReply(reply, Errors.ALREADY_DISABLED);
		return;
	}
	await disabled2FA(user);
	sendReply(reply, Success.TWOWFA_DISABLED);
}

export { request2FA, verify2FA, enable2FA, disable2FA };
