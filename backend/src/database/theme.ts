import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Theme";

interface Theme {
	id?: number;
	name: string;
}

async function createTheme(name: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO ${TABLE_NAME} (name) VALUES (?)`,
		[name]), "createTheme");
}

async function getAllThemes(): Promise<Theme[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM ${TABLE_NAME}`), "getAllThemes");
}

async function getThemeById(id: number): Promise<Theme | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
		[id]), "getThemeById");
}

async function updateTheme(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET name = ? WHERE id = ?`,
		[newName, id]), "updateTheme");
}

async function deleteTheme(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteTheme");
}