import { getDB } from "./init.js";

export interface Theme {
	id?: number;
	name: string;
}

export async function createTheme(name: string): Promise<void> {
	const db = await getDB();
	await db.run(`INSERT INTO theme (name) VALUES (?)`, [name]);
	await db.close();
}

export async function getAllTheme(): Promise<Theme[]> {
	const db = await getDB();
	const themes: Theme[] = await db.all(`SELECT * FROM Theme`);
	await db.close();
	return themes;
}

export async function getThemeById(id: number): Promise<Theme | undefined> {
	const db = await getDB();
	const theme: Theme | undefined = await db.get(`SELECT * FROM Theme WHERE id = ?`, [id]);
	await db.close();
	return theme;
}

export async function updateTheme(id: number, newName: string): Promise<void> {
	const db = await getDB();
	await db.run(`UPDATE Theme SET name = ? WHERE id = ?`, [id, newName]);
	await db.close();
}

export async function deleteTheme(id: number): Promise<void> {
	const db = await getDB();
	await db.run(`DELETE FROM User WHERE id = ?`, [id]);
	await db.close();
}