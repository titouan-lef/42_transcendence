import nodemailer from "nodemailer";
import { FastifyRequest, FastifyReply } from "fastify";
import { randomInt } from "../utils/math.js";
import { sendReply } from "../utils/HTTP.js";
import { disabled2FA, enabled2FA, getUserEmail, is2FAEnabled, isEmailDefined, updateEmail } from "../database/user.js";
import { addAuthCookies } from "./JWT.js";
import { wait } from "../utils/time.js";
import { Errors, Success } from "#shared/status_codes.js";
import { Content2FA } from "#shared/HTTP.js";

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

const CODES_EMAIL = new Map<string, string>();
const CODES_2FA = new Map<string, number>();

/**************************************************************************
 *		REGEX Explanations
 * ^ 				— Start of string
 * [...]			— Character class
 * ^ inside [...]	— Negation -> match any character EXCEPT those listed
 * \s 				— Whitespace
 * $				— End of string anchor
 **************************************************************************/
function isValidEmail(email: string): boolean {
	return (
		!/[\r\n]/.test(email) &&					// Protection again sevral emails injection
		/^[^\s@+]+@[^\s@]+\.[^\s@]+$/.test(email)	// Format validation
	);
}

function sendEmailCode(email: string, code: number): boolean {
	if (!isValidEmail(email))
		return false;
	try {
		EMAIL.sendMail({
			from: process.env.EMAIL,
			to: email,
			subject: "Your 2FA Code",
			text: `Your verification code is: ${code}`,
		});
		return true;
	} catch (err) {
		console.log(`invalid email`, email); /** @todo remove */
		return false;
	}
}

async function request2FA(user: string, email?: string): Promise<boolean> {
	const code = randomInt(1000, 9999);
	if (email)
		CODES_EMAIL.set(user, email);
	else
		email = await getUserEmail(user);
	if (!sendEmailCode(email, code))
		return false;
	if (CODES_2FA.has(user))
		CODES_2FA.delete(user);
	CODES_2FA.set(user, code);
	setTimeout(() => { // self deleting codes after 10 minutes 
		CODES_2FA.delete(user);
		CODES_EMAIL.delete(user);
	}, 10 * 60 * 1000);
	return true;
}

async function verify2FA(req: FastifyRequest<{ "Body": Content2FA }>, reply: FastifyReply): Promise<void> {
	const { user, code } = req.body;
	if (Number(code) !== CODES_2FA.get(user)) {
		wait(1000); // wait 1 sec against brutforce
		sendReply(reply, Errors.INVALID_2FA_CODE);
		return;
	}
	CODES_2FA.delete(user);
	if (await is2FAEnabled(user)) {
		addAuthCookies(reply, user);
		sendReply(reply, Success.LOOGED_IN);
	} else {
		const email = CODES_EMAIL.get(user);
		if (!email) {
			sendReply(reply, Errors.INVALID_EMAIL);
			return;
		}
		await updateEmail(user, email);
		sendReply(reply, Success.USER_UPDATED);
	}
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
