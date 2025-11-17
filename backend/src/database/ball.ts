import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Ball";

interface Ball {
	id: number;
	name: string;
}

async function createBall(name: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (name) VALUES (?)`, [name]
		), "createBall"
	);
}

async function getAllBalls(): Promise<Ball[] | undefined> {
	return applyQuery(
		async (db) => await db.all(
			`SELECT * FROM ${TABLE_NAME}`
		), "getAllBall"
	);
}

async function getBallById(id: number): Promise<Ball | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,[id]
		), "getBallById"
	);
}

export { Ball };
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