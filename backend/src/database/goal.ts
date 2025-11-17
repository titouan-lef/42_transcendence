import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Goal";

interface Goal {
	id: number;
	scoredAt: string;
	gameId: number;
	username: string;
}

async function createGoal(gameId: number, username: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (gameId, by) VALUES (?, ?)`,
			[gameId, username]
		), "createGoal"
	);
}

async function getAllGoals(): Promise<Goal[] | undefined> {
	return applyQuery(
		async (db) => await db.all(
			`SELECT * FROM ${TABLE_NAME}`
		),"getAllGoals"
	);
}

async function getGoalById(id: number): Promise<Goal | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
			[id]
		), "getGoalById"
	);
}

export { Goal };
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