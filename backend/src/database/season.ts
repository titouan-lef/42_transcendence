import { applyQuery, fetchAll } from "./db_utils.js";

interface Season {
	id: number;
	startedAt: string;
}

const TABLE_NAME = "Season";

async function createSeasonTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			startedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertSeason(): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} DEFAULT VALUES;`
		), "insert" + TABLE_NAME
	);
}

async function getSeasonStartedAtById(id: number): Promise<Date> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT startedAt
			FROM ${TABLE_NAME}
			WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
	if (!row)
		return new Date();
	return new Date(row.startedAt);
}

async function getCurrentSeason(): Promise<number> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT id FROM ${TABLE_NAME} ORDER BY startedAt DESC LIMIT 1`,
		), "getCurrent" + TABLE_NAME
	);
	if (!row)
		return 0;
	return (row.id);
}

async function getFirstSeason(): Promise<number> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT id FROM ${TABLE_NAME} ORDER BY startedAt ASC LIMIT 1`,
		), "getFirst" + TABLE_NAME
	);
	if (!row)
		return 0;
	return (row.id);
}

async function getEndSeason(season: number): Promise<Date> {
	const row = await applyQuery(
		async (db) => await db.get(
			` SELECT startedAt FROM ${TABLE_NAME} 
				WHERE startedAt > (SELECT startedAt FROM ${TABLE_NAME} WHERE id = ?)
				ORDER BY startedAt ASC LIMIT 1; 
			`, [season]

		), "getEnd" + TABLE_NAME
	);
	if (!row)
		return new Date();
	return new Date(row.startedAt);
}

export { Season, createSeasonTable, 
	getCurrentSeason, insertSeason,
	getSeasonStartedAtById,	getFirstSeason, getEndSeason };
