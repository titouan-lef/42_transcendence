import { applyQuery, fetchAll } from "./db_utils.js";

interface Theme {
	id: number;
	name: string;
}

const TABLE_NAME = "Theme";

async function createThemeTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertTheme(name: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (name) VALUES (?)`,
			[name]
		), "insert" + TABLE_NAME
	);
}

async function getAllTheme(): Promise<Theme[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getThemeById(id: number): Promise<Theme | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
}

export { Theme, createThemeTable };
/**
 * @todo voir si on garde
async function updateTheme(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET name = ? WHERE id = ?`,
		[newName, id]), "updateTheme");
}

async function deleteTheme(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteTheme");
}*/
