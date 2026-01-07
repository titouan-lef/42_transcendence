import { applyQuery } from "./db_utils.js";

interface Goal {
	id: number;
	scoredAt: string;
	mapId: number;
	ballId: number;
	gameId: number;
	username: string;
}

const TABLE_NAME = "Goal";

async function createGoalTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			scoredAt INTEGER NOT NULL,
			mapId INTEGER REFERENCES Map(id),
			ballId INTEGER REFERENCES Ball(id),
			gameId INTEGER REFERENCES Game(id),
			by TEXT REFERENCES User(username));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertGoal(mapId: number, ballId: number, username: string, timer: number, gameId: number): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (mapId, ballId, gameId, scoredAt, by) VALUES (?, ?, ?, ?, ?)`,
			[mapId, ballId, gameId, timer, username]
		), "insert" + TABLE_NAME
	);
}

export { Goal, createGoalTable, insertGoal };
