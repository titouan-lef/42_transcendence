import { GoalChart, WinrateChart } from "src/user_management/dashboard.js";
import { applyQuery } from "./db_utils.js";
import { BallOption, MapOption } from "#shared/types_transfert.js";

async function getGoalAverageBySeason(seasonId: number, username: string): Promise<number> {
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
			`SELECT COUNT(Goal.id) FROM Goal JOIN Game ON Goal.gameId = Game.id
			WHERE Goal.by = ? AND Game.seasonId = ?;`,
			[username, seasonId]
		), "getGoalAverageBySeason"
	);
	if (!nbGame || !nbGoal)
		return 0;
	if (nbGame.nbGame === 0)
		return 0;
	return (nbGoal.goals / nbGame.nbGame);
}

async function getGoalAverageGlobal(username: string): Promise<number> {
	const nbGame = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nbGame
			FROM Elo AS E Inner JOIN Game As G ON E.gameId = G.id
			WHERE E.username = ?;`,
			[username]
		), "getGoalAverageGlobal"
	);

	const nbGoal = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(Goal.id) FROM Goal WHERE Goal.by = ?;`,
			[username]
		), "getGoalAverageGlobal"
	);
	if (!nbGame || !nbGoal)
		return 0;
	if (nbGame.nbGame === 0)
		return 0;
	return (nbGoal.goals / nbGame.nbGame);
}

async function getGameTimeAverageBySeason(seasonId: number, username: string): Promise<number> {
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

async function getGameTimeAverageGlobal(username: string): Promise<number> {
	const nbTime = await applyQuery(
		async (db) => await db.get(
			`WITH gamePlayed AS (SELECT * FROM Game AS G
			INNER JOIN Elo AS E ON E.gameId = G.id
			WHERE E.username = ?)
			SELECT SUM(duration) AS sumTime FROM gamePlayed;`,
			[username]
		), "getGameTimeAverageGlobal"
	);

	const nbGame = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nbGame
			FROM Elo AS E Inner JOIN Game As G ON E.gameId = G.id
			WHERE E.username = ?;`,
			[username]
		), "getGameTimeAverageGlobal"
	);

	if (!nbGame || !nbTime)
		return 0;
	if (nbGame.nbGame === 0)
		return 0;
	return (nbTime.sumTime / nbGame.nbGame);
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
			`SELECT G.beganAt AS dateGame, E.variation
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
			`SELECT G.beganAt AS dateGame, E.variation
			FROM Elo E
			JOIN Game G ON E.gameId = G.id
			WHERE E.username = ? AND G.seasonId = ?
			ORDER BY G.beganAt ASC LIMIT 7;`,[username, seasonId]
		), "getEloVariatonBySeason"
	);
	return tab ?? [];
}

function dateToString(date: Date): string {
	return date.toLocaleString("en-GB", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});
}

async function getWinrateBySeasonAndDate(seasonId: number, username: string, dates: string[]): Promise<WinrateChart> {
	const dateTab: string[] = [];
	const winrateTab: number[] = [];

	for (const date of dates) {
		const row = await applyQuery(
			async (db) => await db.get(
				`SELECT 
					COUNT(*) AS total,
					SUM(CASE WHEN E.variation > 0 THEN 1 ELSE 0 END) AS wins
				FROM Elo AS E
				INNER JOIN Game AS G ON E.gameId = G.id
				WHERE E.username = ? AND G.seasonId = ? AND G.beganAt <= ?;`,
				[username, seasonId, date]
			), "getWinrateBySeasonAndDate"
		);

		const total = row?.total || 0;
		const wins = row?.wins || 0;
		const winrate = total > 0 ? (wins / total) * 100 : 0;

		dateTab.push(dateToString(new Date(date)));
		winrateTab.push(Math.round(winrate * 100) / 10);
	}

	const history: WinrateChart = { dateList: dateTab, winrateList: winrateTab };
	return history;
}

async function getWinrateGlobalAndDate(username: string, dates: string[]): Promise<WinrateChart> {

	const dateTab: string[] = [];
	const winrateTab: number[] = [];

	for (const date of dates) {
		const row = await applyQuery(
			async (db) => await db.get(
				`SELECT 
					COUNT(*) AS total,
					SUM(CASE WHEN E.variation > 0 THEN 1 ELSE 0 END) AS wins
				FROM Elo AS E
				INNER JOIN Game AS G ON E.gameId = G.id
				WHERE E.username = ? AND G.beganAt <= ?;`,
				[username, date]
			), "getWinrateGlobalAndDate"
		);

		const total = row?.total || 0;
		const wins = row?.wins || 0;
		const winrate = total > 0 ? (wins / total) * 100 : 0;

		dateTab.push(dateToString(new Date(date)));
		winrateTab.push(Math.round(winrate * 100) / 10);
	}

	const history: WinrateChart = { dateList: dateTab, winrateList: winrateTab };
	return history;
}

async function getGoalAverageBySeasonAndDate(seasonId: number, username: string, dates: string[]): Promise<GoalChart> {
	const dateTab: string[] = [];
	const goalTab: number[] = [];

	for (const date of dates) {
		const row = await applyQuery(
			async (db) => await db.get(
				`WITH MyGames AS (SELECT gameId FROM Elo WHERE username = ?),
				GoalsScored AS (
					SELECT COUNT(*) as scored
					FROM Goal g
					JOIN Game gm ON g.gameId = gm.id
					WHERE g.by = ?
					AND gm.seasonId =?
					AND gm.beganAt <= ?
					),
				GoalsConceded AS (
					SELECT COUNT(*) as conceded
					FROM Goal g
					JOIN Game gm ON g.gameId = gm.id
					WHERE g.gameId IN (SELECT gameId FROM MyGames)
					AND g.by != ?
					AND gm.seasonId = ?
					AND gm.beganAt <= ?
				)
				SELECT 
					(SELECT scored FROM GoalsScored) AS goalsScored,
					(SELECT conceded FROM GoalsConceded) AS goalsConceded,
					((SELECT scored FROM GoalsScored) - (SELECT conceded FROM GoalsConceded)) AS goalsAverage;
				`,
				[username,
					username, seasonId, date,
					username, seasonId, date, ]
			), "getGoalAveragebySeasonAndDate"
		);
		dateTab.push(dateToString(new Date(date)));
		goalTab.push(row.goalsAverage);
	}

	const history: GoalChart = { dateList: dateTab, goalList: goalTab };
	return history;
}

async function getGoalAverageGlobalAndDate(username: string, dates: string[]): Promise<GoalChart> {
	const dateTab: string[] = [];
	const goalTab: number[] = [];

	for (const date of dates) {
		const row = await applyQuery(
			async (db) => await db.get(
				`WITH MyGames AS (SELECT gameId FROM Elo WHERE username = ?),
				GoalsScored AS (
					SELECT COUNT(*) as scored
					FROM Goal g
					JOIN Game gm ON g.gameId = gm.id
					WHERE g.by = ?
					AND gm.beganAt <= ?
					),
				GoalsConceded AS (
					SELECT COUNT(*) as conceded
					FROM Goal g
					JOIN Game gm ON g.gameId = gm.id
					WHERE g.gameId IN (SELECT gameId FROM MyGames)
					AND g.by != ?
					AND gm.beganAt <= ?
				)
				SELECT 
					(SELECT scored FROM GoalsScored) AS goalsScored,
					(SELECT conceded FROM GoalsConceded) AS goalsConceded,
					((SELECT scored FROM GoalsScored) - (SELECT conceded FROM GoalsConceded)) AS goalsAverage;
				`,
				[username,
					username, date,
					username, date, ]
			), "getGoalAveragebySeasonAndDate"
		);
		dateTab.push(dateToString(new Date(date)));
		goalTab.push(row.goalsAverage);
	}

	const history: GoalChart = { dateList: dateTab, goalList: goalTab };
	return history;
}

export { getGoalAverageBySeason, getGoalAverageGlobal,
	getGameTimeAverageBySeason, getGameTimeAverageGlobal,
	getWinrateBySeasonAndDate, getWinrateGlobalAndDate,
	getGoalAverageBySeasonAndDate, getGoalAverageGlobalAndDate,
	getPreferedBallBySeason, getPreferedBallGlobal,
	getPreferedMapBySeason, getPreferedMapGlobal,
	getEloVariatonGlobal, getEloVariatonBySeason, EloHistory };
