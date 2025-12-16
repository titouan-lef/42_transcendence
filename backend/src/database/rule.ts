import { applyQuery, fetchAll } from "./db_utils.js";

interface Rule {
	id: number;
	name: string;
}

const TABLE_NAME = "Rule";

async function createRuleTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertRules(): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT OR IGNORE INTO ${TABLE_NAME} (name) VALUES ('spin'),
			('rotate'),
			('canonCount'),
			('dash'),
			('wind');`
		), "insert" + TABLE_NAME
	);
}

async function getAllRule(): Promise<Rule[] | undefined> {
	return await fetchAll(TABLE_NAME);
}

async function getRuleById(id: number): Promise<Rule | undefined> {
	return await applyQuery(
		async (db) => await db.get(
			`SELECT *
			FROM ${TABLE_NAME}
			WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
}

async function getRuleId(name: string): Promise<number | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT id FROM ${TABLE_NAME} WHERE name = ?`,
			[name]
		),
		"getRuleId"
	);
	return row?.id;
}

export { Rule, createRuleTable, insertRules, getRuleId };
/**
 * @todo see if we keep it
async function updateRule(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET name = ? WHERE id = ?`,
		[newName, id]), "updateRule");
}

async function deleteRule(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteRule");
}*/
