import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

async function getDB(): Promise<Database> {
	return open({
		filename: "./database.db",
		driver: sqlite3.Database,
	});
}

async function initDB(): Promise<void> {
	const db = await getDB();

	await db.exec(`
		CREATE TABLE IF NOT EXISTS Theme (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS User (
			username TEXT PRIMARY KEY,
			pseudo TEXT NOT NULL,
			createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			hashedPassword TEXT NOT NULL,
			ppLink TEXT NOT NULL,
			themeId INTEGER REFERENCES Theme(id)
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Friendship (
			username TEXT PRIMARY KEY,
			friendName TEXT NOT NULL
		);
	`);void
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Season (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			beganAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Map (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Ball (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Rule (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Game (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			beganAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			mapId INTEGER REFERENCES Map(id),
			ballId INTEGER REFERENCES Ball(id),
			seasonId INTEGER REFERENCES Season(id)
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Goal (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			scoredAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			gameId INTEGER REFERENCES Game(id),
			by TEXT REFERENCES User(pseudo)
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Game_rule (
			gameId INTEGER,
			ruleId INTEGER,
			isEnable INTEGER NOT NULL,
			PRIMARY KEY (gameId, ruleId),
			FOREIGN KEY (gameId) REFERENCES Game(id),
			FOREIGN KEY (ruleId) REFERENCES Rule(id)
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Elo (
			username TEXT,
			gameId INTEGER,
			variation INTEGER NOT NULL,
			PRIMARY KEY (username, gameId),
			FOREIGN KEY (username) REFERENCES User(username),
			FOREIGN KEY (gameId) REFERENCES Game(id)
		)
	`);
	await db.close();
}

export { getDB, initDB };
