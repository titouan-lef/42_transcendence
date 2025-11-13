import { applyQuery } from "./db_utils.js";

export interface Elo {
	username: string;
	gameId: number;
	variation: number;
}

export async function createElo(elo: Elo): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO Elo (username, gameId, variation) VALUES (? ,? ,?)`,
		[elo.username, elo.gameId, elo.variation]), "createElo");
}

export async function getAllElos(): Promise<Elo[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM Elo`), "getAllElos");
}

export async function getElo(username: string, gameId: number): Promise<Elo | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM Elo WHERE username = ? And gameId = ?`,
		[username, gameId]), "getElo");
}


export async function updateElo(elo: Elo): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE Elo SET variation = ? WHERE username = ? AND gameId = ?`,
		[elo.variation, elo.username, elo.gameId]), "updateElo");
}

export async function deleteElo(username: string, gameId: number): Promise<void> {
	applyQuery(async (db) => await db.run(
		`DELETE FROM Elo WHERE username = ? AND gameId = ?`,
		[username, gameId]), "deleteElo");
}