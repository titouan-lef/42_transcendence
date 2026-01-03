import { LeaderboardInfos } from "#shared/HTTP.js";
import { applyQuery } from "./db_utils.js";
import { getGamesWinsBySeason, getGamesWinsGlobal } from "./fetchGame.js";
import { getCurrentSeason } from "./season.js";
import { getElo } from "./web3/contract_service.js";

interface LeaderboardQuery {
	username: string;
	nick: string;
	nbGame: number;
}

/** @todo get all elo in one blockchains query */
async function getSeasonInfosGlobal(): Promise<LeaderboardInfos[]> {
	const users: LeaderboardQuery[] | undefined = await applyQuery(
		async (db) => await db.all(
			`SELECT
				U.username,
				U.nick,
				COUNT(DISTINCT E.gameId) AS nbGame
			FROM User AS U
			JOIN Elo AS E ON E.username = U.username
			JOIN Game AS G ON E.gameId = G.id
			GROUP BY U.username, U.nick
			HAVING nbGame > 0;`,
		), "getSeasonInfosGlobal"
	);

	if (!users)
		return [];

	const result: LeaderboardInfos[] = [];
	for (const user of users) {
		const elo = await getElo(user.username, await getCurrentSeason());
		const wins = await getGamesWinsGlobal(user.username);

		result.push({
			nick: user.nick,
			elo: elo.r,
			winrate: user.nbGame > 0 ? wins / user.nbGame : 0,
			nbGamePlayed: user.nbGame
		});
	}
	result.sort((a, b) => b.elo - a.elo);
	return result;
}

async function getSeasonInfosBySeason(season: number): Promise<LeaderboardInfos[]> {
	const users: LeaderboardQuery[] | undefined = await applyQuery(
		async (db) => await db.all(
			`SELECT
				U.username,
				U.nick,
				COUNT(DISTINCT E.gameId) AS nbGame
			FROM User AS U
			JOIN Elo AS E ON E.username = U.username
			JOIN Game AS G ON E.gameId = G.id
			WHERE G.seasonId = ?
			GROUP BY U.username, U.nick
			HAVING nbGame > 0;`,
			[season]
		), "getSeasonInfosGlobal"
	);

	if (!users)
		return [];
	const result: LeaderboardInfos[] = [];
	for (const user of users) {
		const elo = await getElo(user.username, season);
		const wins = await getGamesWinsBySeason(season, user.username);

		result.push({
			nick: user.nick,
			elo: elo.r,
			winrate: user.nbGame > 0 ? wins / user.nbGame : 0,
			nbGamePlayed: user.nbGame
		});
	}
	result.sort((a, b) => b.elo - a.elo);
	return result;
}

export { getSeasonInfosGlobal, getSeasonInfosBySeason };
