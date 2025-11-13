import { applyQuery } from "./db_utils.js";

export interface Goal {
	id?: number;
	scoredAt?: string;
	gameId?: number;
	by?: string;
}

export async function createGoal(goal: Goal): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO Goal (gameId, by) VALUES (?, ?)`,
		[goal.gameId, goal.by]), "createGoal");
}

export async function getAllGoals(): Promise<Goal[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM Goal`),"getAllGoals");
}

export async function getGoalById(id: number): Promise<Goal | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM Goal WHERE id = ?`,
		[id]), "getGoalById");
}

export async function updateGoal(id: number, updates: Partial<Omit<Goal, "id" | "scoredAt">>): Promise<void> {
	return applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields) 
			return;
		const values = Object.values(updates);
		await db.run(`UPDATE Goal SET ${fields} WHERE id = ?`, [...values, id]);
	}, "updateGoal");
}

export async function deleteGoal(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM Goal WHERE id = ?`, [id]), "deleteGoal");
}