import { applyQuery } from "./db_utils.js";

export interface Map {
	id?: number;
	name: string;
}

export async function createMap(name: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO Map (name) VALUES (?)`,
		[name]), "createMap");
}

export async function getAllMaps(): Promise<Map[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM Map`), "getAllMap");
}

export async function getMapById(id: number): Promise<Map | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM Map WHERE id = ?`,
		[id]), "getMapById");
}

export async function updateMap(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE Map SET name = ? WHERE id = ?`,
		[newName, id]), "updateMap");
}

export async function deleteMap(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM Map WHERE id = ?`, [id]), "deleteMap");
}