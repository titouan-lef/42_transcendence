import { FastifyRequest, FastifyReply } from "fastify";
import { Errors, Success } from "#shared/status_codes.js";
import { GameHistory, GameHistoryWithAvatar } from "#shared/HTTP.js";
import { sendReply } from "../utils/HTTP.js";
import { applyQuery } from "../database/db_utils.js";
import { fileExists } from "./user_infos.js";
import { UserBody } from "./connect_user.js";

async function getUserHistoryInfos(username: string): Promise<GameHistory[]> {
	const history: GameHistory[] | undefined = await applyQuery(
		async (db) => await db.all(
			`SELECT
				Game.beganAt AS date,
				Game.duration AS duration,
				Game.seasonId AS season,
				E2.username AS opponent,
				(SELECT COUNT(*) FROM Goal WHERE gameId = Game.id AND by = E1.username) AS my_score,
				(SELECT COUNT(*) FROM Goal WHERE gameId = Game.id AND by = E2.username) AS opponent_score,
				E1.variation AS elo_variation
			FROM Game
				JOIN Elo AS E1 ON Game.id = E1.gameId
				JOIN Elo AS E2 ON Game.id = E2.gameId
			WHERE E1.username = ? AND E2.username != ?
			ORDER BY Game.beganAt DESC
			`, [username, username]
		), "getUserHistoryInfos"
	);
	if (!history)
		return [];
	return history;
}

async function getHistory(req: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply): Promise<void> {
	const user = req.body?.user;
	if (!user) {
		sendReply(reply, Errors.NO_USER_GIVEN);
		return;
	}
	const history: GameHistory[] = await getUserHistoryInfos(user);
	const historyWithAvatar: GameHistoryWithAvatar[] = await Promise.all(
		history.map(async (game) => ({
			...game,
			isAvatarSet: await fileExists(`/app/backups/pictures/${game.opponent}`),
		}))
	);
	sendReply(reply, Success.USER_HISTORY_INFOS, JSON.stringify(historyWithAvatar));
}

export { getHistory };
