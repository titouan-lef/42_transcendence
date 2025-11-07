import { getDB } from "./init.js";

export interface Season {
	id?: number;
	beganAt: string;
}

export async function createSeason(): Promise<void> {
	const db = await getDB();
	await db.run(`INSERT INTO Season (beganAT) VALUES (CURRENT_TIMESTAMP)`);
	await db.close();
}

export async function getAllSeasons(): Promise<Season[]> {
	const db = await getDB();
	const seasons: Season[] = await db.all('SELECT * FROM Season');
	await db.close();
	return seasons;
}

export async function getSeasonsById(id: number): Promise<Season | undefined> {
	const db = await getDB();
	const season: Season | undefined = await db.get(`SELECT * FROM Season WHERE id = ?`, [id]);
	await db.close();
	return season;
}

export async function updateSeason(id: number, newDate: string): Promise<void> {
	const db = await getDB();
	await db.run(`UPDATE Season SET began_at = ? WHERE id = ?`, [newDate, id]);
	await db.close();
}
export async function deleteSeason(id: number): Promise<void> {
	const db = await getDB();
	await db.run(`DELETE FROM Season WHERE id = ?`, [id]);
	await db.close();
}