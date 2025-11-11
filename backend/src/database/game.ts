import { getDB } from "./init.js";

export interface Game {
	id?: number;
	beganAt?: string;
	mapId?: number;
	ballId?: number;
	seasonId?: number;
}

export async function createGame(game: Game): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`INSERT INTO Game (mapId, ballId, seasonId) VALUES (?, ?, ?)`,
			[game.mapId, game.ballId, game.seasonId]);
	} finally {
		await db.close();
	}
}

export async function getAllGames(): Promise<Game[]> {
	const db = await getDB();
	try {
		const games: Game[] = await db.all(`SELECT * FROM Game`);
		return games;
	} finally {
		await db.close();
	}
}

export async function getGameById(id: number): Promise<Game | undefined> {
	const db = await getDB();
	try {
		const game: Game | undefined = await db.get(`SELECT * FROM Game WHERE id = ?`, [id]);
		return game;
	} finally {
		await db.close();
	}
}

export async function updateGame(id: number, updates: Partial<Omit<Game, "id" | "beganAt">>): Promise<void> {
	const db = await getDB();
	try {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
			return ;
		const values =Object.values(updates);
		await db.run(`UPDATE Game SET ${fields} WHERE id = ?`, [...values, id]);
	} finally {
		await db.close();
	}
}

export async function deleteGame(id: number): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`DELETE FROM Game WHERE id = ?`, [id]);
	} finally {
		await db.close();
	}
}