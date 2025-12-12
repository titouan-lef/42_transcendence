import { FastifyReply, FastifyRequest } from "fastify";
import { getUserByUsername, is2FAEnabled } from "../database/user.js";
import { sendReply } from "../utils/HTTP.js";
import { getTheme } from "../database/theme.js";

interface InfoList {
	username: string;
	pseudo: string;
	email: string | null;
	enabled2FA: boolean;
	theme: string | null;
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
		pseudo: user.pseudo,
		email: user.email,
		enabled2FA: Boolean(await is2FAEnabled(username)),
		theme: theme
	};
	sendReply(reply, 200, JSON.stringify(infoList));
}

export { getUserInfos };
