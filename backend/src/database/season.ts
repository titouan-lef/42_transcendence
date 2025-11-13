import { applyQuery } from "./db_utils.js";

export interface Season {
	id?: number;
	name: string;
}

export async function createSeason(name: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO Season (name) VALUES (?)`,
		[name]), "createSeason");
}

export async function getAllSeasons(): Promise<Season[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM Season`), "getAllSeason");
}

export async function getSeasonById(id: number): Promise<Season | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM Season WHERE id = ?`,
		[id]), "getSeasonById");
}

export async function updateSeason(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE Season SET name = ? WHERE id = ?`,
		[newName, id]), "updateSeason");
}

export async function deleteSeason(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM Season WHERE id = ?`, [id]), "deleteSeason");
}