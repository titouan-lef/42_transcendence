import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Map";

interface Map {
	id?: number;
	name: string;
}

async function createMap(name: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO ${TABLE_NAME} (name) VALUES (?)`,
		[name]), "createMap");
}

async function getAllMaps(): Promise<Map[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM ${TABLE_NAME}`), "getAllMap");
}

async function getMapById(id: number): Promise<Map | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
		[id]), "getMapById");
}

export { createMap, getAllMaps, getMapById };
/** 
 * @todo voir si on garde
async function updateMap(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET name = ? WHERE id = ?`,
		[newName, id]), "updateMap");
}

async function deleteMap(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteMap");
}
*/