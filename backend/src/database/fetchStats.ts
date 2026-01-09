import { applyQuery } from "./db_utils.js";
import { BallOption, MapOption } from "#shared/types_transfert.js";
import { getGamesPlayedCountBySeason, getGamesPlayedCountGlobal } from "./fetchGame.js";
import { DataChartType } from "#shared/HTTP.js";
import { POINTS_TO_WIN } from "../game/settings/values.js";

async function getGoalAverageBySeason(seasonId: number, username: string): Promise<number> {
	const nbGame: number = await getGamesPlayedCountBySeason(seasonId, username);
	const nbGoals = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(Goal.id) AS nbGoals FROM Goal JOIN Game ON Goal.gameId = Game.id
			WHERE Goal.by = ? AND Game.seasonId = ?;`,
			[username, seasonId]
		), "getGoalAverageBySeason"
	);
	if (!nbGoals)
		return 0;
	if (nbGame === 0)
		return 0;
	return (nbGoals.nbGoals / nbGame);
}

async function getGoalAverageGlobal(username: string): Promise<number> {
	const nbGame: number = await getGamesPlayedCountGlobal(username);
	const nbGoal = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(Goal.id) AS nbGoals FROM Goal WHERE Goal.by = ?;`,
			[username]
		), "getGoalAverageGlobal"
	);
	if (!nbGoal)
		return 0;
	if (nbGame === 0)
		return 0;
	return (nbGoal.nbGoals / nbGame);
}

async function getGameTimeAverageBySeason(seasonId: number, username: string): Promise<number> {
	const nbGame: number = await getGamesPlayedCountBySeason(seasonId, username);
	const nbTime = await applyQuery(
		async (db) => await db.get(
			`WITH gamePlayed AS (SELECT * FROM Game AS G
			INNER JOIN Elo AS E ON E.gameId = G.id
			WHERE E.username = ? AND G.seasonId = ?)
			SELECT SUM(duration) AS sumTime FROM gamePlayed;`,
			[username, seasonId]
		), "getGameTimeAverageBySeason"
	);

	if (!nbTime)
		return 0;
	if (nbGame === 0)
		return 0;
	return (nbTime.sumTime / nbGame);
}

async function getGameTimeAverageGlobal(username: string): Promise<number> {
	const nbGame: number = await getGamesPlayedCountGlobal(username);
	const nbTime = await applyQuery(
		async (db) => await db.get(
			`WITH gamePlayed AS (SELECT * FROM Game AS G
			INNER JOIN Elo AS E ON E.gameId = G.id
			WHERE E.username = ?)
			SELECT SUM(duration) AS sumTime FROM gamePlayed;`,
			[username]
		), "getGameTimeAverageGlobal"
	);
	if (!nbTime)
		return 0;
	if (nbGame === 0)
		return 0;
	return (nbTime.sumTime / nbGame);
}

async function getPreferedBallBySeason(seasonId: number, username: string): Promise<BallOption> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT Ball.name
			FROM Ball
			JOIN Goal ON Ball.id = Goal.ballId
			JOIN Game ON Goal.gameId = Game.id
			WHERE Goal.by = ? AND Game.seasonId = ?
			GROUP BY Ball.id
			ORDER BY COUNT(Goal.id) DESC
			LIMIT 1;`,
			[username, seasonId]
		), "getPreferedBallBySeason"
	);
	if(!row)
		return ("default");
	return (row.name);
}

async function getPreferedBallGlobal(username: string): Promise<BallOption> {
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
	if(!row)
		return ("default");
	return (row.name);
}

async function getPreferedMapBySeason(seasonId: number, username: string): Promise<MapOption> {
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
		), "getPreferedMapBySeason"
	);
	if(!row)
		return ("default");
	return (row.name);
}

async function getPreferedMapGlobal(username: string): Promise<MapOption> {
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
	if(!row)
		return ("default");
	return (row.name);
}

interface EloHistory {
	date: string;
	variation: number;
}

async function getEloVariatonGlobal(username: string): Promise<EloHistory[]> {
	const tab: EloHistory[] | undefined = await applyQuery(
		async (db) => await db.all(
			`SELECT G.beganAt AS date, E.variation
			FROM Elo E
			JOIN Game G ON E.gameId = G.id
			WHERE E.username = ?
			ORDER BY G.beganAt DESC;`, [username]
		), "getAllEloVariaton"
	);
	return tab ?? [];
}

async function getEloVariatonBySeason(seasonId: number, username: string): Promise<EloHistory[]> {
	const tab = await applyQuery(
		async (db) => await db.all<EloHistory[]>(
			`SELECT G.beganAt AS date, E.variation
			FROM Elo E
			JOIN Game G ON E.gameId = G.id
			WHERE E.username = ? AND G.seasonId = ?
			ORDER BY G.beganAt DESC;`,[username, seasonId]
		), "getEloVariatonBySeason"
	);
	return tab ?? [];
}

function dateToString(date: Date): string {
	return date.toISOString().slice(0, 19).replace("T", " ");
}

async function getWinrateOverPeriod(username: string, startDate: string, endDate: string): Promise<DataChartType[]> {
	const games = await applyQuery(
		async (db) => await db.all(
			`SELECT G.id, G.beganAt,
					CASE WHEN SUM(CASE WHEN GO.by = ? THEN 1 ELSE 0 END) = ${POINTS_TO_WIN} THEN 1 ELSE 0 END AS win
			FROM Game AS G
			LEFT JOIN Goal AS GO ON G.id = GO.gameId
			WHERE G.beganAt BETWEEN ? AND ?
			GROUP BY G.id
			ORDER BY G.beganAt ASC;`,
			[username, startDate, endDate]
		),
		"getWinrateOverPeriod"
	);

	if (!games)
		return [];

	const result: DataChartType[] = [];
	let totalGames = 0;
	let totalWins = 0;

	for (let i = 0; i < games.length; i++) {
		const game = games[i];
		totalGames += 1;
		totalWins += game.win ? 1 : 0;

		const winrate = Math.round((totalWins / totalGames) * 100);
		const timestamp = new Date(game.beganAt).getTime();

		result.push({ x: timestamp, y: winrate });
	}

	return result;
}

export { EloHistory,
	getGoalAverageBySeason, getGoalAverageGlobal,
	getGameTimeAverageBySeason, getGameTimeAverageGlobal,
	getPreferedBallBySeason, getPreferedBallGlobal,
	getPreferedMapBySeason, getPreferedMapGlobal,
	getEloVariatonGlobal, getEloVariatonBySeason,
	dateToString, getWinrateOverPeriod };
