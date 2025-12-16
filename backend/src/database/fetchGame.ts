import { applyQuery } from "./db_utils.js";

async function getGamesPlayedCount(seasonId: number, username: string): Promise<number | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT 
				COUNT(Elo.gameId) FROM Elo
			INNER JOIN Game ON Elo.gameId = Game.id
			WHERE 
				Game.seasonId = ? AND Elo.username = ? 
				GROUP BY Game.seasonId, Elo.username;`,
			[seasonId, username]
		), "getGamesPlayedCount"
	);
	return row.gamesPlayedCount;
}

async function getGamesWinsBySeason(seasonId: number, username: string): Promise<number | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`WITH GamesPlayed AS (
			SELECT 
				* FROM Elo 
			INNER JOIN Game ON Elo.gameId = Game.id 
			WHERE 
				Game.seasonId = ? 
				AND Elo.username = ?
			)
			SELECT
				COUNT(gameId) FROM GamesPlayed
			WHERE Elo.variation >= 0;`,
			[seasonId, username]
		), "getGamesPlayedCount"
	);
	return row.gamesWonCount;
}

async function getGamesLoosesBySeason(seasonId: number, username: string): Promise<number | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`WITH GamesPlayed AS (
			SELECT 
				* FROM Elo 
			INNER JOIN Game ON Elo.gameId = Game.id 
			WHERE 
				Game.seasonId = ? 
				AND Elo.username = ?
			)
			SELECT
				COUNT(gameId) FROM GamesPlayed
			WHERE Elo.variation < 0;`,
			[seasonId, username]
		), "getGamesPlayedCount"
	);
	return row.gamesLoseCount;
}

export { getGamesPlayedCount,getGamesWinsBySeason, getGamesLoosesBySeason };