import { applyQuery } from "./db_utils.js";

export interface Ball {
	id?: number;
	name: string;
}

export async function createBall(name: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO Ball (name) VALUES (?)`,
		[name]), "createBall");
}

export async function getAllBalls(): Promise<Ball[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM Ball`), "getAllBall");
}

export async function getBallById(id: number): Promise<Ball | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM Ball WHERE id = ?`,
		[id]), "getBallById");
}

export async function updateBall(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE Ball SET name = ? WHERE id = ?`,
		[newName, id]), "updateBall");
}

export async function deleteBall(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM Ball WHERE id = ?`, [id]), "deleteBall");
}