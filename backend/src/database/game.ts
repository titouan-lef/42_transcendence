import { applyQuery, fetchAll } from "./db_utils.js";

const TABLE_NAME = "Game";

interface Game {
	id: number;
	beganAt: string;
	mapId: number; /** @todo null ? */
	ballId: number; /** @todo null ? */
	seasonId: number; /** @todo null ? */
}

async function createGame(mapId: number, ballId: number, seasonId: number): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (mapId, ballId, seasonId) VALUES (?, ?, ?)`,
			[mapId, ballId, seasonId]
		), "createGame"
	);
}

async function getAllGames(): Promise<Game[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getGameById(id: number): Promise<Game | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
			[id]
		), "getGameById"
	);
}

export { Game };
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