import { getDB } from "./init.js";

export interface Season {
	id?: number;
	beganAt: string;
}

export async function createSeason(): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`INSERT INTO Season (beganAT) VALUES (CURRENT_TIMESTAMP)`);
	} finally {
		await db.close();
	}
}

export async function getAllSeasons(): Promise<Season[]> {
	const db = await getDB();
	try {
		const seasons: Season[] = await db.all('SELECT * FROM Season');
		return seasons;
	} finally {
		await db.close();
	}
}

export async function getSeasonsById(id: number): Promise<Season | undefined> {
	const db = await getDB();
	try {
		const season: Season | undefined = await db.get(`SELECT * FROM Season WHERE id = ?`, [id]);
		return season;
	} finally {
		await db.close();
	}
}

export async function updateSeason(id: number, newDate: string): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`UPDATE Season SET began_at = ? WHERE id = ?`, [newDate, id]);
	} finally {
		await db.close();
	}
}
export async function deleteSeason(id: number): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`DELETE FROM Season WHERE id = ?`, [id]);
	} finally {
		await db.close();
	}
}


/////////
/**
 * 
 * @param id 
 * @returns 

function test(id: number): number {
	const oui = 20;
	id = id + oui;
	return id;
}

(id: number): number => {
	const oui = 20;
	id = id + oui;
	return id;
}

applyFunction((db) => {
	const elos: Elo[] = await db.all(`SELECT * FROM Elo`);
	return elos;
});
*/