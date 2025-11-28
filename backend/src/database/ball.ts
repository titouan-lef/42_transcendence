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

async function insertBall(name: string): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT OR IGNORE INTO ${TABLE_NAME} (name) VALUES (?)`, [name]
		), "insert" + TABLE_NAME
	);
}

async function getAllBalls(): Promise<Ball[] | undefined> {
	return await fetchAll(TABLE_NAME);
}

async function getBallById(id: number): Promise<Ball | undefined> {
	return await applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,[id]
		), "get" + TABLE_NAME + "ById"
	);
}

export { Ball, createBallTable, insertBall };
