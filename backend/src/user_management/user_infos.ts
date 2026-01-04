import { FastifyReply, FastifyRequest } from "fastify";
import { getUserByUsername, is2FAEnabled } from "../database/user.js";
import { sendReply } from "../utils/HTTP.js";
import { getTheme } from "../database/theme.js";
import { promises as fs } from "fs";
import { Success } from "#shared/status_codes.js";

interface InfoList {
	username: string;
	nickname: string;
	email: string | null;
	is2FAEnabled: boolean;
	isAvatarSet: boolean;
	theme: string | null;
}

async function fileExists(path: string): Promise<boolean> {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
}

async function getUserInfos(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const username = req.user;
	if (!username)
		return;

	const user = await getUserByUsername(username);
	if (!user)
		return;

	let theme: string | null = null;
	if (user.themeId !== null)
		theme = await getTheme(user.themeId);
	const infoList: InfoList = {
		username: username,
		nickname: user.nickname,
		email: user.email,
		is2FAEnabled: await is2FAEnabled(username),
		isAvatarSet: await fileExists(`/app/backups/pictures/${user.username}`),
		theme: theme
	};
	sendReply(reply, Success.USER_INFOS, JSON.stringify(infoList));
}

export { getUserInfos, fileExists };
