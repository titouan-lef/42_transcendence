import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Game_rule";

interface GameRule {
	gameId: number;
	ruleId: number;
	isEnable: number;
}

async function createGameRule(gameRule: GameRule): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO ${TABLE_NAME} (gameId, ruleId, isActive) VALUES (? ,? , ?)`,
		[gameRule.gameId, gameRule.ruleId, gameRule.isEnable]
	),"createGameRule");
}

async function getAllGameRules(): Promise<GameRule[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM ${TABLE_NAME}`), "getAllGameRules");
}

async function getGameRule(gameId: number, ruleId: number): Promise<GameRule | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM ${TABLE_NAME} WHERE gameId = ? AND ruleId = ?`,
		[gameId, ruleId]), "getGameRule");
}

export { createGameRule, getAllGameRules, getGameRule };
/**
 * @todo voiir si on garde
async function updateGameRule(gameId: number, ruleId: number, updates: Partial<Omit<GameRule, "gameId" | "ruleId">>): Promise<void> {
	applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
		return;
		const values = Object.values(updates);
		await db.run(`UPDATE ${TABLE_NAME} SET ${fields} WHERE gameId = ? AND ruleId = ?`,
		[...values, gameId, ruleId]);
	}, "updateGameRule");
}

async function deleteGameRule(gameId: number, ruleId: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE gameId = ? AND ruleId = ?`,
	[gameId, ruleId]), "deleteGameRule");
}
*/
