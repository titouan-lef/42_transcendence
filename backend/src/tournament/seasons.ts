import { FastifyRequest, FastifyReply } from "fastify";
import { Errors, Success } from "#shared/status_codes.js";
import { LeaderboardInfos } from "#shared/HTTP.js";
import { sendReply } from "../utils/HTTP.js";
import { getCurrentSeason } from "../database/season.js";
import { getSeasonInfosBySeason, getSeasonInfosGlobal } from "../database/leaderboard.js";

interface SeasonParams {
	id: number;
}

async function getSeasonStats(req: FastifyRequest<{ Params: SeasonParams }>, reply: FastifyReply): Promise<void> {
	const season = Number(req.params.id);
	if (Number.isNaN(season)) {
		sendReply(reply, Errors.NO_SEASON_GIVEN);
		return;
	}
	if (season < 0 || season > await getCurrentSeason()) {
		sendReply(reply, Errors.INVALID_SEASON);
		return;
	}
	let leaderboardInfos: LeaderboardInfos;
	if (season === 0)
		leaderboardInfos = await getSeasonInfosGlobal();
	else
		leaderboardInfos = await getSeasonInfosBySeason(season);

	sendReply(reply, Success.LEADERBOARD_INFOS, JSON.stringify(leaderboardInfos));
}

export { getSeasonStats };
