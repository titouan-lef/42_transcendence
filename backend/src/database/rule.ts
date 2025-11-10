import { getDB } from "./init.js";

export interface Rule {
	id?: number;
	name: string;
}

export async function createRule(name: string): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`INSERT INTO Rule (name) VALUES (?)`, [name]);
	} finally{
		await db.close();
	}
}

export async function getAllRules(): Promise<Rule[]> {
	const db = await getDB();
	try {
		const rules: Rule[] = await db.all(`SELECT * FROM Rule`);
		return rules;
	} finally{
		await db.close();
	}
}

export async function getRuleById(id: number): Promise<Rule | undefined> {
	const db = await getDB();
	try {
		const rule: Rule | undefined = await db.get(`SELECT * FROM Rule WHERE id = ?`, [id]);
		return rule;
	} finally{
		await db.close();
	}
}

export async function updateRule(id: number, newName: string): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`UPDATE Rule SET name = ? WHERE id = ?`, [newName, id]);
	} finally{
		await db.close();
	}
}

export async function deleteRule(id: number): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`DELETE FROM Rule WHERE id = ?`, [id]);
	} finally{
		await db.close();
	}
}