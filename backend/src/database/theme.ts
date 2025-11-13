import { applyQuery } from "./db_utils.js";

export interface Theme {
	id?: number;
	name: string;
}

export async function createTheme(name: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO Theme (name) VALUES (?)`,
		[name]), "createTheme");
}

export async function getAllThemes(): Promise<Theme[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM Theme`), "getAllTheme");
}

export async function getThemeById(id: number): Promise<Theme | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM Theme WHERE id = ?`,
		[id]), "getThemeById");
}

export async function updateTheme(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE Theme SET name = ? WHERE id = ?`,
		[newName, id]), "updateTheme");
}

export async function deleteTheme(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM Theme WHERE id = ?`, [id]), "deleteTheme");
}