import { applyQuery, fetchAll } from "./db_utils.js";

interface Game {
	id: number;
	beganAt: string;
	mapId: number;
	ballId: number;
	seasonId: number | null;
}

const TABLE_NAME = "Game";

async function createGameTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			beganAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			mapId INTEGER REFERENCES Map(id),
			ballId INTEGER REFERENCES Ball(id),
			seasonId INTEGER REFERENCES Season(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertGame(mapId: number, ballId: number, seasonId: number | null): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (mapId, ballId, seasonId) VALUES (?, ?, ?)`,
			[mapId, ballId, seasonId]
		), "insert" + TABLE_NAME
	);
}

async function getAllGames(): Promise<Game[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getGameById(id: number): Promise<Game | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT *
			FROM ${TABLE_NAME}
			WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
}

async function getGamesBySeason(seasonId: number):Promise<Game[] | undefined> {
	return applyQuery(
		async (db) => await db.all(
			`SELECT *
			FROM ${TABLE_NAME}
			WHERE seasonId = ?`,
			[seasonId]
		), "get" + TABLE_NAME + "BySeason"
	);
}

export { Game, createGameTable };
/**
 * 
 * @todo see if we keep it
async function updateGame(id: number, updates: Partial<Omit<Game, "id" | "beganAt">>): Promise<void> {
	applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
		return ;
		const values =Object.values(updates);
		await db.run(`UPDATE ${TABLE_NAME} SET ${fields} WHERE id = ?`, [...values, id]);
	}, "updateGame");
}

async function deleteGame(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]), "deleteGame");
	
}
*/
