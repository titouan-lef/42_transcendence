import { applyQuery, fetchAll } from "./db_utils.js";

interface Ball {
	id: number;
	name: string;
}

const TABLE_NAME = "Ball";

async function createBallTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertBalls(): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT OR IGNORE INTO ${TABLE_NAME} (name) VALUES
			('default'),
			('invisible'),
			('pulse'),
			('snake'),
			('tricky');`
		), "insert" + TABLE_NAME
	);
}

async function getBallId(name: string): Promise<number | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT id FROM ${TABLE_NAME} WHERE name = ?`,
			[name]
		),
		"getBallId"
	);
	return row?.id;
}

export { Ball, createBallTable, insertBalls, getBallId };
