import { applyQuery } from "./db_utils.js";

export interface GameRule {
	gameId: number;
	ruleId: number;
	isActive: number;
}

export async function createGameRule(gameRule: GameRule): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO Game_rule (gameId, ruleId, isActive) VALUES (? ,? , ?)`,
		[gameRule.gameId, gameRule.ruleId, gameRule.isActive]
	),"createGameRule");
}

export async function getAllGameRules(): Promise<GameRule[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM Game_rule`), "getAllGameRules");
}

export async function getGameRule(gameId: number, ruleId: number): Promise<GameRule | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM Game_rule WHERE gameId = ? And ruleId = ?`,
		[gameId, ruleId]), "getGameRule");
}

export async function updateGameRule(gameId: number, ruleId: number, updates: Partial<Omit<GameRule, "gameId" | "ruleId">>): Promise<void> {
	applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields) 
			return;
		const values = Object.values(updates);
		await db.run(`UPDATE Game_rule SET ${fields} WHERE gameId = ? AND ruleId = ?`,
			[...values, gameId, ruleId]);
	}, "updateGameRule");
}

export async function deleteGameRule(gameId: number, ruleId: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM Game_rule WHERE gameId = ? AND ruleId = ?`,
		[gameId, ruleId]), "deleteGameRule");
}
