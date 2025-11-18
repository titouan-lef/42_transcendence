import { applyQuery, fetchAll } from "./db_utils.js";

const TABLE_NAME = "Ball";

interface Ball {
	id: number;
	name: string;
}

async function createBallTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertBall(name: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (name) VALUES (?)`, [name]
		), "insert" + TABLE_NAME
	);
}

async function getAllBalls(): Promise<Ball[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getBallById(id: number): Promise<Ball | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,[id]
		), "get" + TABLE_NAME + "ById"
	);
}

export { Ball, createBallTable };
/**
 * @todo voir si on garde
async function updateBall(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET name = ? WHERE id = ?`,
		[newName, id]), "updateBall");
	}
	
	async function deleteBall(id: number): Promise<void> {
		applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteBall");
	}
*/