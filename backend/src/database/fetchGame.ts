import { applyQuery } from "./db_utils.js";

const NB_GOALS_TO_WIN = 11;

async function getGamesPlayedCount(seasonId: number, username: string): Promise<number | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nbGame
			FROM Elo AS E Inner JOIN Game As G ON E.gameId = G.id
			WHERE E.username = ? AND G.seasonId = ?;`,
			[username, seasonId]
		), "getGamesPlayedCount"
	);
	return row?.nbGame;
}

async function getGamesWinsBySeason(seasonId: number, username: string): Promise<number | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`WITH GamesScores AS (
				SELECT G.gameId, COUNT(G.gameId) AS GoalCount
				FROM Goal AS G INNER JOIN Game AS Gm ON G.gameId = Gm.id
				WHERE Gm.seasonId = ? AND G.by = ?
				GROUP BY G.gameId
			)
			SELECT COUNT(gameId) AS gamesWinCount
			FROM GamesScores
			WHERE GoalCount = ${NB_GOALS_TO_WIN};`,
			[username, seasonId]
		), "getGamesPlayedCount"
	);
	return row?.gamesWinCount;
}

async function getGamesLoosesBySeason(seasonId: number, username: string): Promise<number | undefined> {
	const playedCount = await getGamesPlayedCount(seasonId, username);
	if (!playedCount)
		return undefined;
	const winCount = await getGamesWinsBySeason(seasonId, username);
	if (!winCount)
		return undefined;
	return (playedCount - winCount);
}

export { getGamesPlayedCount,getGamesWinsBySeason, getGamesLoosesBySeason };
