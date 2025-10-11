import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";


export async function getDb(): Promise<Database> {
	return open({
		filename: "./database.db",
		driver: sqlite3.Database,
	});
}

export async function initDB(): Promise<void> {
	const db = await getDb();

	await db.exec(`
		CREATE TABLE IF NOT EXISTS Users (
			id TEXT PRIMARY KEY,
			pseudo TEXT,
			creation DATETIME DEFAULT CURRENT_TIMESTAMP,
			hashedPassword TEXT,
			ppLink TEXT
		)
	`);
	await db.close();
}