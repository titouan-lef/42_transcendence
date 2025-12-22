import { applyQuery } from "./db_utils.js";

async function getGoalAverage(username: string): Promise<number | undefined> {
	const nbGame = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nbGame
			FROM Elo AS E Inner JOIN Game As G ON E.gameId = G.id
			WHERE E.username = ?;`,
			[username]
		), "getGoalAverage"
	);

	const nbGoal = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS goals FROM Goal WHERE Goal.by = ?;`,
			[username]
		), "getGoalAverage"
	);
	if (!nbGame || !nbGoal)
		return 0;
	if (nbGame.nbGame === 0)
		return 0;
	return (nbGoal.goals / nbGame.nbGame);
}

async function getGoalAverageBySeason(seasonId: number, username: string): Promise<number | undefined> {
	const nbGame = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nbGame
			FROM Elo AS E Inner JOIN Game As G ON E.gameId = G.id
			WHERE E.username = ? AND G.seasonId = ?;`,
			[username, seasonId]
		), "getGoalAverageBySeason"
	);

	const nbGoal = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS goals FROM Goal WHERE Goal.by = ? AND Goal.seasonId = ?;`,
			[username, seasonId]
		), "getGoalAverageBySeason"
	);
	if (!nbGame || !nbGoal)
		return 0;
	if (nbGame.nbGame === 0)
		return 0;
	return (nbGoal.goals / nbGame.nbGame);
}

async function getGameTimeAverage(username: string): Promise<number | undefined> {
	const nbTime = await applyQuery(
		async (db) => await db.get(
			`WITH gamePlayed AS (SELECT * FROM Game AS G
			INNER JOIN Elo AS E ON E.gameId = G.id
			WHERE E.username = ?)
			SELECT SUM(duration) AS sumTime FROM gamePlayed;`,
			[username]
		), "getGameTimeAverage"
	);

	const nbGame = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nbGame
			FROM Elo AS E Inner JOIN Game As G ON E.gameId = G.id
			WHERE E.username = ?;`,
			[username]
		), "getGameTimeAverage"
	);

	if (!nbGame || !nbTime)
		return 0;
	if (nbGame.nbGame === 0)
		return 0;
	return (nbTime.sumTime / nbGame.nbGame);
}

async function getGameTimeAverageBySeason(seasonId: number, username: string): Promise<number | undefined> {
	const nbTime = await applyQuery(
		async (db) => await db.get(
			`WITH gamePlayed AS (SELECT * FROM Game AS G
			INNER JOIN Elo AS E ON E.gameId = G.id
			WHERE E.username = ? AND G.seasonId = ?)
			SELECT SUM(duration) AS sumTime FROM gamePlayed;`,
			[username, seasonId]
		), "getGameTimeAverageBySeason"
	);

	const nbGame = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nbGame
			FROM Elo AS E Inner JOIN Game As G ON E.gameId = G.id
			WHERE E.username = ? AND G.seasonId = ?;`,
			[username, seasonId]
		), "getGameTimeAverageBySeason"
	);
	if (!nbGame || !nbTime)
		return 0;
	if (nbGame.nbGame === 0)
		return 0;
	return (nbTime.sumTime / nbGame.nbGame);
}

async function getPreferedBall(username: string): Promise<string | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT B.name, COUNT(G.id) AS total_goals
			FROM Ball B
			JOIN Goal G ON B.id = G.ballId
			JOIN Game GA ON G.gameId = GA.id
			WHERE G.by = ?
			GROUP BY B.id
			ORDER BY total_goals DESC
			LIMIT 1;`,
			[username]
		), "getPreferedBall"
	);
	return (row?.name);
}

async function getPreferedBallBySeason(seasonId: number, username: string): Promise<string | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT B.name, COUNT(G.id) AS total_goals
			FROM Ball B
			JOIN Goal G ON B.id = G.ballId
			JOIN Game GA ON G.gameId = GA.id
			WHERE G.by = '? AND GA.seasonId = ?
			GROUP BY B.id
			ORDER BY total_goals DESC
			LIMIT 1;`,
			[username, seasonId]
		), "getPreferedBallBySeason"
	);
	return (row?.name);
}

async function getPreferedMap(username: string): Promise<string | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT M.name, COUNT(G.id) AS total_goals
			FROM Map M
			JOIN Goal G ON M.id = G.mapId
			JOIN Game GA ON G.gameId = GA.id
			WHERE G.by = ?
			GROUP BY M.id
			ORDER BY total_goals DESC
			LIMIT 1;`,
			[username]
		), "getPreferedMap"
	);
	return (row?.name);
}

async function getPreferedMaBySeason(seasonId: number, username: string): Promise<string | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT M.name, COUNT(G.id) AS total_goals
			FROM Map M
			JOIN Goal G ON M.id = G.mapId
			JOIN Game GA ON G.gameId = GA.id
			WHERE G.by = ? AND GA.seasonId = ?
			GROUP BY M.id
			ORDER BY total_goals DESC
			LIMIT 1;`,
			[username, seasonId]
		), "getPreferedMaBySeason"
	);
	return (row?.name);
}

interface EloHistory {
	date: string;
	variation: number;
}

async function getAllEloVariaton(username: string): Promise<EloHistory[] | undefined> {
	const tab: EloHistory[] | undefined = await applyQuery(
		async (db) => await db.all(
			`SELECT G.beganAt AS dateGame, E.variation
			FROM Elo E
			JOIN Game G ON E.gameId = G.id
			WHERE E.username = ?
			ORDER BY G.beganAt DESC;`, [username]
		), "getAllEloVariaton"
	);
	return tab;
}

async function getAllEloVariatonBySeason(seasonId: number, username: string): Promise<EloHistory[] | undefined> {
	const tab: EloHistory[] | undefined = await applyQuery(
		async (db) => await db.all(
			`SELECT G.beganAt AS dateGame, E.variation
			FROM Elo E
			JOIN Game G ON E.gameId = G.id
			WHERE E.username = ? AND G.seasonId = ?
			ORDER BY G.beganAt DESC;`,[username, seasonId]
		), "getAllEloVariatonBySeason"
	);
	return tab;
}

export { getGoalAverage, getGoalAverageBySeason,
	getGameTimeAverage, getGameTimeAverageBySeason,
	getPreferedBall, getPreferedBallBySeason,
	getPreferedMap, getPreferedMaBySeason,
	getAllEloVariaton, getAllEloVariatonBySeason, EloHistory };
