import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Season";
interface Season {
	id?: number;
	startedAT?: string;
}

async function createSeason(name: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO ${TABLE_NAME} (name) VALUES (?)`,
		[name]), "createSeason");
}

async function getAllSeasons(): Promise<Season[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM ${TABLE_NAME}`), "getAllSeason");
}

async function getSeasonById(id: number): Promise<Season | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
		[id]), "getSeasonById");
}

export { createSeason, getAllSeasons, getSeasonById };
/**
 * @todo voir si on garde
async function updateSeason(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET name = ? WHERE id = ?`,
		[newName, id]), "updateSeason");
}

async function deleteSeason(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteSeason");
}*/