import { applyQuery, fetchAll } from "./db_utils.js";

interface Map {
	id: number;
	name: string;
}

const TABLE_NAME = "Map";

async function createMapTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertMaps(): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT OR IGNORE INTO ${TABLE_NAME} (name) VALUES
			('default'),
			('desert'),
			('sky'),
			('volcano');`
		), "insert" + TABLE_NAME
	);
}

async function getMapId(name: string): Promise<number | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT id FROM ${TABLE_NAME} WHERE name = ?`,
			[name]
		),
		"getMapId"
	);
	return row?.id;
}

export { Map, createMapTable, insertMaps, getMapId };
