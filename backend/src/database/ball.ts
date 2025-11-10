import { getDB } from "./init.js";

export interface Ball {
	id?: number;
	name: string;
}

export async function createBall(name: string): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`INSERT INTO Ball (name) VALUES (?)`, [name]);
	} finally{
		await db.close();
	}
}

export async function getAllBalls(): Promise<Ball[]> {
	const db = await getDB();
	try {
		const balls: Ball[] = await db.all(`SELECT * FROM Ball`);
		return balls;
	} finally{
		await db.close();
	}
}

export async function getBallById(id: number): Promise<Ball | undefined> {
	const db = await getDB();
	try {
		const ball: Ball | undefined = await db.get(`SELECT * FROM Ball WHERE id = ?`, [id]);
		return ball;
	} finally{
		await db.close();
	}
}

export async function updateBall(id: number, newName: string): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`UPDATE Ball SET name = ? WHERE id = ?`, [newName, id]);
	} finally{
		await db.close();
	}
}

export async function deleteBall(id: number): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`DELETE FROM Ball WHERE id = ?`, [id]);
	} finally{
		await db.close();
	}
}