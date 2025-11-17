import { applyQuery, fetchAll } from "./db_utils.js";

const TABLE_NAME = "Rule";

interface Rule {
	id: number;
	name: string;
}

async function createRule(name: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (name) VALUES (?)`,
			[name]
		), "createRule"
	);
}

async function getAllRules(): Promise<Rule[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getRuleById(id: number): Promise<Rule | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
			[id]
		), "getRuleById"
	);
}

export { Rule };
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