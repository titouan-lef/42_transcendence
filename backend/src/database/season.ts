import { applyQuery, fetchAll } from "./db_utils.js";

interface Season {
	id: number;
	startedAT: string;
}

const TABLE_NAME = "Season";

async function createSeasonTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			beganAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertSeason(): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} DEFAULT VALUES;`
		), "insert" + TABLE_NAME
	);
}

async function getAllSeason(): Promise<Season[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getSeasonById(id: number): Promise<Season | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
}

export { Season, createSeasonTable };
/**
 * @todo see if we keep it
async function updateSeason(id: number, newName: string): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET name = ? WHERE id = ?`,
		[newName, id]), "updateSeason");
}

async function deleteSeason(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteSeason");
}*/
