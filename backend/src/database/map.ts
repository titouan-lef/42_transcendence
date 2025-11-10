import { getDB } from "./init.js";

export interface Map {
	id?: number;
	name: string;
}

export async function createMap(name: string): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`INSERT INTO Map (name) VALUES (?)`, [name]);
	} finally{
		await db.close();
	}
}

export async function getAllMaps(): Promise<Map[]> {
	const db = await getDB();
	try {
		const maps: Map[] = await db.all(`SELECT * FROM Map`);
		return maps;
	} finally{
		await db.close();
	}
}

export async function getMapById(id: number): Promise<Map | undefined> {
	const db = await getDB();
	try {
		const map: Map | undefined = await db.get(`SELECT * FROM Map WHERE id = ?`, [id]);
		return map;
	} finally{
		await db.close();
	}
}

export async function updateMap(id: number, newName: string): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`UPDATE Map SET name = ? WHERE id = ?`, [newName, id]);
	} finally{
		await db.close();
	}
}

export async function deleteMap(id: number): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`DELETE FROM Map WHERE id = ?`, [id]);
	} finally{
		await db.close();
	}
}