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
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			beganAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			duration INTEGER,
			seasonId INTEGER REFERENCES Season(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertGame(seasonId: number): Promise<number | undefined> {
	return applyQuery(
		async (db) => {
			const result = await db.run(
				`INSERT INTO ${TABLE_NAME} (seasonId) VALUES (?)`,
				[seasonId]
			);
			return result.lastID;
		},
		"insert" + TABLE_NAME
	);
}

async function setGameDuration(gameId: number, duration: number): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`UPDATE ${TABLE_NAME}
			 SET duration = ?
			 WHERE id = ?`,
			[duration, gameId]
		),
		"set" + TABLE_NAME + "Duration"
	);
}

async function getAllGames(): Promise<Game[] | undefined> {
	return await fetchAll(TABLE_NAME);
}

async function getGameById(id: number): Promise<Game | undefined> {
	return await applyQuery(
		async (db) => await db.get(
			`SELECT *
			FROM ${TABLE_NAME}
			WHERE id = ?`,
			[id]
		), "get" + TABLE_NAME + "ById"
	);
}

async function getGamesBySeason(seasonId: number):Promise<Game[] | undefined> {
	return await applyQuery(
		async (db) => await db.all(
			`SELECT *
			FROM ${TABLE_NAME}
			WHERE seasonId = ?`,
			[seasonId]
		), "get" + TABLE_NAME + "BySeason"
	);
}

export { Game, createGameTable, insertGame, setGameDuration, getGameById };
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
