import { getDB } from "./init.js";

export interface GameRule {
	gameId: number;
	ruleId: number;
	isActive: number;
}

export async function createGameRule(gameRule: GameRule): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`INSERT INTO Game_rule (gameId, ruleId, isActive) VALUES (? ,? , ?)`,
			[gameRule.gameId, gameRule.ruleId, gameRule.isActive]);
	} finally {
		await db.close();
	}
}

export async function getAllGameRules(): Promise<GameRule[]> {
	const db = await getDB();
	try {
		const rules: GameRule[] = await db.all(`SELECT * FROM Game_rule`);
		return rules;
	} finally {
		await db.close();
	}
}

export async function getGameRule(gameId: number, ruleId: number): Promise<GameRule | undefined> {
	const db = await getDB();
	try {
		const rule: GameRule | undefined = await db.get(`SELECT * FROM Game_rule WHERE gameId = ? And ruleId = ?`, [gameId, ruleId]);
		return rule;
	} finally {
		await db.close();
	}
}

export async function updateGameRule(gameId: number, ruleId: number, updates: Partial<Omit<GameRule, "gameId" | "ruleId">>): Promise<void> {
	const db = await getDB();
	try {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields) 
			return;
		const values = Object.values(updates);
		await db.run(`UPDATE Game_rule SET ${fields} WHERE gameId = ? AND ruleId = ?`,
			[...values, gameId, ruleId]);
	} finally {
		await db.close();
	}
}

export async function deleteGameRule(gameId: number, ruleId: number): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`DELETE FROM Game_rule WHERE gameId = ? AND ruleId = ?`, [gameId, ruleId]);
	} finally {
		await db.close();
	}
}
