import { applyQuery } from "./db_utils.js";

interface Placement {
	rOpp: number;
	rdOpp: number;
	outcome: number;
}

const TABLE_NAME = "Placement";

async function createPlacementTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			username TEXT,
			gameId INTEGER,
			rOpp INTEGER NOT NULL,
			rdOpp REAL NOT NULL,
			outcome REAL NOT NULL,
			PRIMARY KEY (username, gameId),
			FOREIGN KEY (username) REFERENCES User(username),
			FOREIGN KEY (gameId) REFERENCES Game(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertPlacementGame(username: string, gameId: number, placement: Placement): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, gameId, rOpp, rdOpp, outcome) VALUES (?, ?, ?, ?, ?)`,
			[username, gameId, placement.rOpp, placement.rdOpp, placement.outcome]
		), "insert" + TABLE_NAME
	);
}

async function getPlacementGames(username: string, seasonId: number): Promise<Placement[]> {
	const rows = await applyQuery(
		async (db) => await db.all<Placement[]>(
			`SELECT rOpp, rdOpp, outcome
			FROM ${TABLE_NAME}
			WHERE username = ? AND gameId IN (
				SELECT Gm.id
				FROM Game AS Gm
				WHERE Gm.seasonId = ?
			)`,
			[username, seasonId]
		), "get" + TABLE_NAME
	);
	return rows ?? [];
}

export { Placement, createPlacementTable, insertPlacementGame, getPlacementGames };
