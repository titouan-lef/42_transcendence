import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Elo";

interface Elo {
	username: string;
	gameId: number;
	variation: number;
}

async function createElo(elo: Elo): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO ${TABLE_NAME} (username, gameId, variation) VALUES (? ,? ,?)`,
		[elo.username, elo.gameId, elo.variation]), "createElo");
}

async function getAllElos(): Promise<Elo[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM ${TABLE_NAME}`), "getAllElos");
}

async function getElo(username: string, gameId: number): Promise<Elo | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM ${TABLE_NAME} WHERE username = ? AND gameId = ?`,
		[username, gameId]), "getElo");
}

async function updateElo(elo: Elo): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET variation = ? WHERE username = ? AND gameId = ?`,
		[elo.variation, elo.username, elo.gameId]), "updateElo");
}

async function deleteElo(username: string, gameId: number): Promise<void> {
	applyQuery(async (db) => await db.run(
		`DELETE FROM ${TABLE_NAME} WHERE username = ? AND gameId = ?`,
		[username, gameId]), "deleteElo");
}