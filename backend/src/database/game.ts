import { applyQuery, fetchAll } from "./db_utils.js";

interface Game {
	id: number;
	beganAt: string;
	duration: number;
	seasonId: number | null;
}

const TABLE_NAME = "Game";

async function createGameTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			beganAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			duration INTEGER NOT NULL,
			seasonId INTEGER REFERENCES Season(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertGame(seasonId: number, duration: number): Promise<number | undefined> {
	return applyQuery(
		async (db) => {
			const result = await db.run(
				`INSERT INTO ${TABLE_NAME} (seasonId, duration) VALUES (?, ?)`,
				[seasonId, duration]
			);
			return result.lastID;
		},
		"insert" + TABLE_NAME
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

async function getDateLastGame(username: string):Promise<string | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT beganAt
			FROM ${TABLE_NAME} AS G INNER JOIN Elo AS E ON G.id = E.gameId
			WHERE E.username = ?
			ORDER BY G.beganAt DESC
			LIMIT 1`,
			[username]
		), "getDatelast" + TABLE_NAME
	);
	return (row?.beganAt);
}

async function getPlayerGameCountBySeason(username: string, seasonId: number):Promise<number | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT COUNT(*) AS nb_game
			FROM Game AS Gm INNER JOIN Elo AS E ON Gm.id = E.gameId
			WHERE E.username = ? AND Gm.seasonId = ?`,
			[username, seasonId]
		), "getPlayer" + TABLE_NAME + "CountBySeason"
	);
	return (row?.nb_game);
}

export { Game, createGameTable, insertGame, getGameById, getDateLastGame, getPlayerGameCountBySeason };
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
