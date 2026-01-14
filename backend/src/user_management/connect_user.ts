import { FastifyRequest, FastifyReply } from "fastify";
import path from "path";
import fs from "fs";
import util from 'util';
import sharp from "sharp";
import { pipeline } from 'stream';
import { sendReply } from "../utils/HTTP.js";
import { isValidHashedPassword } from "../utils/hash_string.js";
import { getUserPassword, is2FAEnabled, updateTheme } from "../database/user.js";
import { request2FA } from "../security/2FA.js";
import { addAuthCookies, removeAuthCookies } from "../security/JWT.js";
import { wait } from "../utils/time.js";
import { Errors, Success } from "#shared/status_codes.js";
import { NewUserBody, ThemeBody } from "#shared/HTTP.js";
import { resizeGif } from "../utils/images.js";

const PUMP = util.promisify(pipeline);

const ALLOWED_EXTENTIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

const IMAGE_LENGTH = 150;
const IMAGE_WIDTH = IMAGE_LENGTH;

async function connectUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	const { username, password } = req.body;

	const hashPassword: string = await getUserPassword(username);

	if (!isValidHashedPassword(password, hashPassword)) {
		await wait(1000); // wait 1 sec against brutforce
		sendReply(reply, Errors.WRONG_CREDENTIALS);
		return;
	}
	if (await is2FAEnabled(username)) {
		request2FA(username);
		sendReply(reply, Errors.TWOFA_REQUIRED);
		return;
	}
	addAuthCookies(reply, username);
	sendReply(reply, Success.LOOGED_IN);
}

async function disconnectUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	removeAuthCookies(reply);
	sendReply(reply, Success.LOOGED_OUT);
}

async function changePicture(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const part = await req.file();
	if (!part) {
		sendReply(reply, Errors.NO_FILE_GIVEN);
		return;
	}
	const extention = path.extname(part.filename).toLowerCase();
	if (!ALLOWED_EXTENTIONS.includes(extention)) {
		sendReply(reply, Errors.INVALID_FILE_TYPE);
		return;
	}
	const fullPath = `/app/backups/pictures/${user}`;
	try {
		if (extention === `.gif`) {
			const tempPath = `/tmp/${user}`;
			await PUMP(part.file, fs.createWriteStream(tempPath));
			await resizeGif(tempPath, fullPath, IMAGE_LENGTH);
			if (fs.existsSync(tempPath))
				fs.unlinkSync(tempPath);
		} else {
			await PUMP(
				part.file,
				sharp().resize(IMAGE_LENGTH, IMAGE_WIDTH, { fit: "cover", position: "center" }),
				fs.createWriteStream(fullPath)
			);
		}
		sendReply(reply, Success.AVATAR_UPDATED);
	} catch (err) {
		console.error("Error processing avatar:", err);
		sendReply(reply, Errors.REQUEST_FAILED);
	}
}

async function changeTheme(req: FastifyRequest<{ Body:ThemeBody }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const theme = req.body?.theme;
	if (theme === undefined) {
		sendReply(reply, Errors.NO_THEME_GIVEN);
		return;
	}
	await updateTheme(user, theme);
	sendReply(reply, Success.USER_UPDATED);
}

export { connectUser, disconnectUser, changePicture, changeTheme };
