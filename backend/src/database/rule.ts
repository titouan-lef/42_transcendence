import { applyQuery } from "./db_utils.js";

export interface Rule {
	id?: number;
	name: string;
}

export async function createRule(name: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO Rule (name) VALUES (?)`,
		[name]), "createRule");
}

export async function getAllRules(): Promise<Rule[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM Rule`), "getAllRule");
}

export async function getRuleById(id: number): Promise<Rule | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM Rule WHERE id = ?`,
		[id]), "getRuleById");
}

export async function updateRule(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE Rule SET name = ? WHERE id = ?`,
		[newName, id]), "updateRule");
}

export async function deleteRule(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM Rule WHERE id = ?`, [id]), "deleteRule");
}