import { applyQuery, fetchAll } from "./db_utils.js";

interface Rule {
	id: number;
	name: string;
}

const TABLE_NAME = "Rule";

async function createRuleTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertRule(name: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (name) VALUES (?)`,
			[name]
		), "insert" + TABLE_NAME
	);
}

async function getAllRule(): Promise<Rule[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getRuleById(id: number): Promise<Rule | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
}

export { Rule, createRuleTable };
/**
 * @todo voir si on garde
async function updateRule(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET name = ? WHERE id = ?`,
		[newName, id]), "updateRule");
}

async function deleteRule(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteRule");
}*/
