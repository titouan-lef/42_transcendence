import { isValidName } from "../user_management/create_account.js";
import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Elo";

async function createEloTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			username TEXT,
			gameId INTEGER,
			variation INTEGER NOT NULL,
			PRIMARY KEY (username, gameId),
			FOREIGN KEY (username) REFERENCES User(username),
			FOREIGN KEY (gameId) REFERENCES Game(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertEloVariation(username: string, gameId: number, variation: number): Promise<void> {
	if (!isValidName(username))
		username = "guest";
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, gameId, variation) VALUES (? ,? ,?)`,
			[username, gameId, variation]
		), "insert" + TABLE_NAME
	);
}

export { createEloTable, insertEloVariation };
