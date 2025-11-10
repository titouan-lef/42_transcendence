import { getDB } from "./init.js";

export interface Goal {
	id?: number;
	scoredAt?: string;
	gameId?: number;
	by?: string;
}

export async function createGoal(goal: Goal): Promise<void> {
	const db = await getDB();
	try{
		await db.run(`INSERT INTO Goal (gameId, by) VALUES (?, ?)`, [goal.gameId, goal.by]);
	} finally {
		await db.close();
	}
}

export async function getAllGoals(): Promise<Goal[]> {
	const db = await getDB();
	try{
		const goals: Goal[] = await db.all(`SELECT * FROM Goal`);
		return goals;
	} finally {
		await db.close();
	}
}

export async function getGoalById(id: number): Promise<Goal | undefined> {
	const db = await getDB();
	try{
		const goal: Goal | undefined = await db.get(`SELECT * FROM Goal WHERE id = ?`, [id]);
		return goal;
	} finally {
		await db.close();
	}
}

export async function updateGoal(id: number, updates: Partial<Omit<Goal, "id" | "scoredAt">>): Promise<void> {
	const db = await getDB();
	try {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields) 
			return;
		const values = Object.values(updates);
		await db.run(`UPDATE Goal SET ${fields} WHERE id = ?`, [...values, id]);
	} finally {
		await db.close();
	}
}

export async function deleteGoal(id: number): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`DELETE FROM Goal WHERE id = ?`, [id]);
	} finally {
		await db.close();
	}
}