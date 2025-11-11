import { getDB } from "./init.js";

export interface Elo {
	username: string;
	gameId: number;
	variation: number;
}

export async function createElo(elo: Elo): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`INSERT INTO Elo (username, gameId, variation) VALUES (? ,? ,?)`,
			[elo.username, elo.gameId, elo.variation]);
	} finally {
		await db.close();
	}
}

export async function getAllElos(): Promise<Elo[]> {
	const db = await getDB();
	try {
		const elos: Elo[] = await db.all(`SELECT * FROM Elo`);
		return elos;
	} finally {
		await db.close();
	}
}

export async function getElo(username: string, gameId: number): Promise<Elo> {
	const db = await getDB();
	try {
		const elo: Elo = await db.all(`SELECT * FROM Elo WHERE username = ? And gameId = ?`, [username, gameId]);
		return elo;
	} finally {
		await db.close();
	}
}

export async function updateElo(elo: Elo): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`UPDATE Elo SET variation = ? WHERE username = ? AND gameId = ?`,
			[elo.variation, elo.username, elo.gameId]);
	} finally {
		await db.close();
	}
}

export async function deleteElo(username: string, gameId: number): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`DELETE FROM Elo WHERE username = ? AND gameId = ?`, [username, gameId]);
	} finally {
		await db.close();
	}
}