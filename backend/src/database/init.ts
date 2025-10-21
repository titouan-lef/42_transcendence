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
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			hashed_password TEXT NOT NULL,
			pp_link TEXT NOT NULL,
			theme_id INTEGER REFERENCES Theme(id)
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Friendship (
			username TEXT PRIMARY KEY,
			friend_name TEXT NOT NULL
		);
	`);void
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Season (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			began_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
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
			began_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			map_id INTEGER REFERENCES Map(id),
			ball_id INTEGER REFERENCES Ball(id),
			season_id INTEGER REFERENCES Season(id)
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Goal (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			scored_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			game_id INTEGER REFERENCES Game(id),
			by TEXT REFERENCES User(pseudo)
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Game_rule (
			game_id INTEGER,
			rule_id INTEGER,
			is_active INTEGER NOT NULL,
			PRIMARY KEY (game_id, rule_id),
			FOREIGN KEY (game_id) REFERENCES Game(id),
			FOREIGN KEY (rule_id) REFERENCES Rule(id)
		);
	`);
	await db.exec(`
		CREATE TABLE IF NOT EXISTS Elo (
			username TEXT,
			game_id INTEGER,
			variation INTEGER NOT NULL,
			PRIMARY KEY (username, game_id),
			FOREIGN KEY (username) REFERENCES User(username),
			FOREIGN KEY (game_id) REFERENCES Game(id)
		)
	`);
	await db.close();
}

export { getDB, initDB };
