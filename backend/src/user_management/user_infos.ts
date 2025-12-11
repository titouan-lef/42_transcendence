import { FastifyReply, FastifyRequest } from "fastify";
import { getUserByUsername, is2FAEnabled } from "../database/user.js";
import { sendReply } from "../utils/HTTP.js";

interface InfoList {
	username: string;
	pseudo: string;
	email: string | null;
	enabled2FA: boolean;
	//theme;
}

async function getUserInfos(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const username = req.user;
	if (!username)
		return;

	const user = await getUserByUsername(username);
	if (!user)
		return;

	const infoList: InfoList = {
		username: username,
		pseudo: user.pseudo,
		email: user.email,
		enabled2FA: Boolean(await is2FAEnabled(username)),
	};
	sendReply(reply, 200, JSON.stringify(infoList));
}

export { getUserInfos };
