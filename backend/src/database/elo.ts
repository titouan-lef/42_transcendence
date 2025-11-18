import { applyQuery, fetchAll } from "./db_utils.js";

const TABLE_NAME = "Elo";

interface Elo {
	username: string;
	gameId: number;
	variation: number;
}

async function createEloTable(): Promise<void> {
	applyQuery(
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
async function insertElo(elo: Elo): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, gameId, variation) VALUES (? ,? ,?)`,
			[elo.username, elo.gameId, elo.variation]
		), "insert" + TABLE_NAME
	);
}

async function getAllElos(): Promise<Elo[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getElo(username: string, gameId: number): Promise<Elo | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE username = ? AND gameId = ?`,
			[username, gameId]
		), "get" + TABLE_NAME
	);
}

export { Elo, createEloTable };
/**
 * 
 * @todo Voir si on garde
 * 
async function updateElo(elo: Elo): Promise<void> {
	applyQuery(async (db) => await db.run(
		`UPDATE ${TABLE_NAME} SET variation = ? WHERE username = ? AND gameId = ?`,
		[elo.variation, elo.username, elo.gameId]), "updateElo");
}

async function deleteElo(username: string, gameId: number): Promise<void> {
	applyQuery(async (db) => await db.run(
		`DELETE FROM ${TABLE_NAME} WHERE username = ? AND gameId = ?`,
		[username, gameId]), "deleteElo");
	}
*/