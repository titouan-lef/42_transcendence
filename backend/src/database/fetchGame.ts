import { POINTS_TO_WIN } from "../game/settings/values.js";
import { applyQuery } from "./db_utils.js";

/** @todo warning both with titouan branch*/
async function getGamesPlayedCountBySeason(seasonId: number, username: string): Promise<number> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nbGame
			FROM Elo AS E Inner JOIN Game As G ON E.gameId = G.id
			WHERE E.username = ? AND G.seasonId = ?;`,
			[username, seasonId]
		), "getGamesPlayedCountBySeason"
	);
	if (!row)
		return 0;
	return row.nbGame;
}

async function getGamesPlayedCountGlobal(username: string): Promise<number> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nbGame
			FROM Elo AS E Inner JOIN Game As G ON E.gameId = G.id
			WHERE E.username = ?`,
			[username]
		), "getGamesPlayedCountGlobal"
	);
	if (!row)
		return 0;
	return row.nbGame;
}

async function getGamesWinsBySeason(seasonId: number, username: string): Promise<number> {
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
			WHERE GoalCount = ${POINTS_TO_WIN};`,
			[seasonId, username]
		), "getGamesWinsBySeason"
	);
	if (!row)
		return 0;
	return row.gamesWinCount;
}

async function getGamesWinsGlobal(username: string): Promise<number> {
	const row = await applyQuery(
		async (db) => await db.get(
			`WITH GamesScores AS (
				SELECT G.gameId, COUNT(G.gameId) AS GoalCount
				FROM Goal AS G INNER JOIN Game AS Gm ON G.gameId = Gm.id
				WHERE G.by = ?
				GROUP BY G.gameId
			)
			SELECT COUNT(gameId) AS gamesWinCount
			FROM GamesScores
			WHERE GoalCount = ${POINTS_TO_WIN};`,
			[username]
		), "getGamesWinsGlobal"
	);
	if (!row)
		return 0;
	return row.gamesWinCount;
}

export { getGamesWinsBySeason, getGamesWinsGlobal, getGamesPlayedCountBySeason, getGamesPlayedCountGlobal };
