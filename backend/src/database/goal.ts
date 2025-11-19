import { applyQuery, fetchAll } from "./db_utils.js";

interface Goal {
	id: number;
	scoredAt: string;
	gameId: number;
	username: string;
}

const TABLE_NAME = "Goal";

async function createGoalTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			scoredAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			gameId INTEGER REFERENCES Game(id),
			by TEXT REFERENCES User(pseudo));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertGoal(gameId: number, username: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (gameId, by) VALUES (?, ?)`,
			[gameId, username]
		), "insert" + TABLE_NAME
	);
}

async function getAllGoals(): Promise<Goal[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getGoalById(id: number): Promise<Goal | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
}

export { Goal, createGoalTable };
/**
 * 
 * @todo voir si on garde 
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
