import { applyQuery, fetchAll } from "./db_utils.js";

interface GameRule {
	gameId: number;
	ruleId: number;
	isEnable: number;
}

const TABLE_NAME = "Game_rule";

async function createGameRuleTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			gameId INTEGER,
			ruleId INTEGER,
			isEnable INTEGER NOT NULL,
			value INTEGER,
			PRIMARY KEY (gameId, ruleId),
			FOREIGN KEY (gameId) REFERENCES Game(id),
			FOREIGN KEY (ruleId) REFERENCES Rule(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertGameRule(gameId: number, ruleId: number, isEnable: boolean, value?: number): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (gameId, ruleId, isEnable, value) VALUES (?, ?, ?, ?)`,
			[gameId, ruleId, isEnable, value ?? null]
		), "insert" + TABLE_NAME
	);
}

async function getAllGameRules(): Promise<GameRule[] | undefined> {
	return await fetchAll(TABLE_NAME);
}

async function getGameRuleById(gameId: number, ruleId: number): Promise<GameRule | undefined> {
	return await applyQuery(
		async (db) => await db.get(
			`SELECT *
			FROM ${TABLE_NAME}
			WHERE gameId = ?
			AND ruleId = ?`,
			[gameId, ruleId]
		), "get" + TABLE_NAME + "ById"
	);
}

export { GameRule, createGameRuleTable, insertGameRule };
/**
 * @todo see if we keep it
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
