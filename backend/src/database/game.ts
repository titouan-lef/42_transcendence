import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Game";

interface Game {
	id?: number;
	beganAt?: string;
	mapId: number;
	ballId: number;
	seasonId?: number;
}

async function createGame(game: Game): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO ${TABLE_NAME} (mapId, ballId, seasonId) VALUES (?, ?, ?)`,
		[game.mapId, game.ballId, game.seasonId]), "createGame");
}

async function getAllGames(): Promise<Game[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM ${TABLE_NAME}`), "getAllGames");
}

async function getGameById(id: number): Promise<Game | undefined> {
	return applyQuery(async (db) => await db.get(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [id]), "getGameById");
}

export { createGame, getAllGames, getGameById };
/**
 * 
 * @todo voir si on garde
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