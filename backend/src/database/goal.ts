import { applyQuery, fetchAll } from "./db_utils.js";

interface Goal {
	id: number;
	scoredAt: string;
	mapId: number;
	ballId: number;
	gameId: number;
	username: string;
}

const TABLE_NAME = "Goal";

async function createGoalTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			scoredAt INTEGER NOT NULL,
			mapId INTEGER REFERENCES Map(id),
			ballId INTEGER REFERENCES Ball(id),
			gameId INTEGER REFERENCES Game(id),
			by TEXT REFERENCES User(pseudo));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertGoal(mapId: number, ballId: number, username: string, timer: number, gameId: number): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (mapId, ballId, gameId, scoredAt, by) VALUES (?, ?, ?, ?, ?)`,
			[mapId, ballId, gameId, timer, username]
		), "insert" + TABLE_NAME
	);
}

async function getAllGoals(): Promise<Goal[] | undefined> {
	return await fetchAll(TABLE_NAME);
}

async function getGoalById(id: number): Promise<Goal | undefined> {
	return await applyQuery(
		async (db) => await db.get(
			`SELECT *
			FROM ${TABLE_NAME}
			WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
}

async function getPlayerGamesBySeason(seasonId: number, username: string): Promise<number> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(GOAL.gameId) AS gamesPlayedCount
			FROM ${TABLE_NAME} AS GOAL INNER JOIN Game AS GAME ON GOAL.gameId = GAME.id
			WHERE GAME.seasonId = ? AND GOAL.by = ? 
			GROUP BY GAME.seasonId, GOAL.by;`,
			[seasonId, username]
		), "getGamesPlayedCount"
	);
	if (!row)
		return 0;
	return row.gamesPlayedCount;
}

export { Goal, createGoalTable, insertGoal, getPlayerGamesBySeason };
/**
 * 
 * @todo see if we keep it 
async function updateGoal(id: number, updates: Partial<Omit<Goal, "id" | "scoredAt">>): Promise<void> {
	applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
		return;
		const values = Object.values(updates);
		await db.run(`UPDATE ${TABLE_NAME} SET ${fields} WHERE id = ?`, [...values, id]);
	}, "updateGoal");
}

async function deleteGoal(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteGoal");
}
*/
