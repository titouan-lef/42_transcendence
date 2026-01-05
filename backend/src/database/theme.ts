import { applyQuery } from "./db_utils.js";

interface Theme {
	id: number;
	name: string;
}

const TABLE_NAME = "Theme";

async function createThemeTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertThemes(): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT OR IGNORE INTO ${TABLE_NAME} (name) VALUES
			('pizza_lulu'),
			('over_titouan'),
			('sugar_rushtman'),
			('polybius'),
			('neon_hearts'),
			('claw_machine'),
			('lazer_tim'),
			('electronic_eclypse'),
			('please_insert_25c'),
			('ticket_muncher'),
			('electric_pl'),
			('monq');`
		), "insert" + TABLE_NAME
	);
}

async function getTheme(id: number): Promise<string | null> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT name
			FROM ${TABLE_NAME}
			WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
	if (!row)
		return null;
	return (row.name);
}

export { Theme, createThemeTable, insertThemes, getTheme };
