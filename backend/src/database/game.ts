import { applyQuery } from "./db_utils.js";

export interface Game {
	id?: number;
	beganAt?: string;
	mapId?: number;
	ballId?: number;
	seasonId?: number;
}

export async function createGame(game: Game): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO Game (mapId, ballId, seasonId) VALUES (?, ?, ?)`,
		[game.mapId, game.ballId, game.seasonId]), "createGame");
}

export async function getAllGames(): Promise<Game[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM Game`), "getAllGames");
}

export async function getGameById(id: number): Promise<Game | undefined> {
	return applyQuery(async (db) => await db.get(`SELECT * FROM Game WHERE id = ?`, [id]), "getGameById");
}

export async function updateGame(id: number, updates: Partial<Omit<Game, "id" | "beganAt">>): Promise<void> {
	applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
			return ;
		const values =Object.values(updates);
		await db.run(`UPDATE Game SET ${fields} WHERE id = ?`, [...values, id]);
	}, "updateGame");
}

export async function deleteGame(id: number): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM Game WHERE id = ?`, [id]), "deleteGame");

}