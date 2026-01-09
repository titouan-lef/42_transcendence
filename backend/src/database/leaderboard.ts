import { GUEST_NAME } from "#shared/constant.js";
import { LeaderboardInfos } from "#shared/HTTP.js";
import { applyQuery } from "./db_utils.js";
import { getGamesWinsBySeason } from "./fetchGame.js";
import { dateToString } from "./fetchStats.js";
import { getEndSeason, getSeasonStartedAtById } from "./season.js";
import { getAllRatingBySeason } from "./web3/contract_service.js";

interface LeaderboardQuery {
	username: string;
	nickname: string;
	nbGame: number;
}

async function getSeasonInfosBySeason(season: number): Promise<LeaderboardInfos> {
	const users: LeaderboardQuery[] | undefined = await applyQuery(
		async (db) => await db.all(
			`SELECT
				U.username,
				U.nickname,
				COUNT(DISTINCT E.gameId) AS nbGame
			FROM User AS U
			JOIN Elo AS E ON E.username = U.username
			JOIN Game AS G ON E.gameId = G.id
			WHERE G.seasonId = ? AND E.username != '${GUEST_NAME}'
			GROUP BY U.username, U.nickname
			HAVING nbGame > 0;`,
			[season]
		), "getSeasonInfosGlobal"
	);

	const result: LeaderboardInfos = {
		ranking: [],
		beginDate: dateToString(await getSeasonStartedAtById(season)),
		endDate: dateToString(await getEndSeason(season)),
	};

	if (!users)
		return result;
	
	const userTab: string[] = [];
	for (const user of users) {
		userTab.push(user.username);
	}

	const usersElo: number[] = await getAllRatingBySeason(userTab, season);

	for (let i = 0; i < users.length; i++) {
		const wins = await getGamesWinsBySeason(season, users[i].username);

		result.ranking.push({
			username: users[i].username,
			nickname: users[i].nickname,
			rating: usersElo[i],
			winrate: users[i].nbGame > 0 ? wins / users[i].nbGame : 0,
			nbGamePlayed: users[i].nbGame
		});
	}
	result.ranking.sort((a, b) => b.rating - a.rating);
	return result;
}

export { getSeasonInfosBySeason };
