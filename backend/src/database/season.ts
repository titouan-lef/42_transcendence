import { applyQuery, fetchAll } from "./db_utils.js";

const TABLE_NAME = "Season";
interface Season {
	id: number;
	startedAT: string;
}

async function createSeason(): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} DEFAULT VALUES;`
		), "createSeason"
	);
}

async function getAllSeasons(): Promise<Season[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getSeasonById(id: number): Promise<Season | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
			[id]
		), "getSeasonById"
	);
}

export { Season };
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