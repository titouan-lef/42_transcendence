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

async function insertMap(name: string): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT OR IGNORE INTO ${TABLE_NAME} (name) VALUES (?)`,
			[name]
		), "insert" + TABLE_NAME
	);
}

async function getAllMap(): Promise<Map[] | undefined> {
	return await fetchAll(TABLE_NAME);
}

async function getMapById(id: number): Promise<Map | undefined> {
	return await applyQuery(
		async (db) => await db.get(
			`SELECT *
			FROM ${TABLE_NAME}
			WHERE id = ?`,
			[id]
		), "getMapById"
	);
}

export { Map, createMapTable, insertMap };
