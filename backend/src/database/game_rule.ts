import { applyQuery, fetchAll } from "./db_utils.js";

const TABLE_NAME = "Game_rule";

interface GameRule {
	gameId: number;
	ruleId: number;
	isEnable: number;
}

async function createGameRuleTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			gameId INTEGER,
			ruleId INTEGER,
			isEnable INTEGER NOT NULL,
			PRIMARY KEY (gameId, ruleId),
			FOREIGN KEY (gameId) REFERENCES Game(id),
			FOREIGN KEY (ruleId) REFERENCES Rule(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function inserrtGameRule(gameRule: GameRule): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (gameId, ruleId, isActive) VALUES (? ,? , ?)`,
			[gameRule.gameId, gameRule.ruleId, gameRule.isEnable]
		), "insert" + TABLE_NAME
	);
}

async function getAllGameRules(): Promise<GameRule[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getGameRuleById(gameId: number, ruleId: number): Promise<GameRule | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE gameId = ? AND ruleId = ?`,
			[gameId, ruleId]
		), "get" + TABLE_NAME + "ById"
	);
}

export { GameRule, createGameRuleTable };
/**
 * @todo voir si on garde
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
