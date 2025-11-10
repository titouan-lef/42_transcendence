import { getDB } from "./init.js";

export interface Theme {
	id?: number;
	name: string;
}

export async function createTheme(name: string): Promise<void> {
	const db = await getDB();
	try{
		await db.run(`INSERT INTO Theme (name) VALUES (?)`, [name]);
	} finally {
		await db.close();
	}
}

export async function getAllThemes(): Promise<Theme[]> {
	const db = await getDB();
	try{
		const themes: Theme[] = await db.all(`SELECT * FROM Theme`);
		return themes;
	} finally {
		await db.close();
	}
}

export async function getThemeById(id: number): Promise<Theme | undefined> {
	const db = await getDB();
	try{
		const theme: Theme | undefined = await db.get(`SELECT * FROM Theme WHERE id = ?`, [id]);
		return theme;
	} finally {
		await db.close();
	}
}

export async function updateTheme(id: number, newName: string): Promise<void> {
	const db = await getDB();
	try{
		await db.run(`UPDATE Theme SET name = ? WHERE id = ?`, [newName, id]);
	} finally {
		await db.close();
	}
}

export async function deleteTheme(id: number): Promise<void> {
	const db = await getDB();
	try{
		await db.run(`DELETE FROM Theme WHERE id = ?`, [id]);
	} finally {
		await db.close();
	}
}