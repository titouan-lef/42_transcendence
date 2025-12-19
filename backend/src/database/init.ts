import sqlite3 from "sqlite3";
import { existsSync } from "fs";
import { open, Database } from "sqlite";
import { createThemeTable, insertThemes } from "./theme.js";
import { createUserTable } from "./user.js";
import { createFriendshipTable } from "./friendship.js";
import { createSeasonTable, insertSeason } from "./season.js";
import { createMapTable, insertMaps } from "./map.js";
import { createRuleTable, insertRules } from "./rule.js";
import { createBallTable, insertBalls } from "./ball.js";
import { createGameTable } from "./game.js";
import { createEloTable } from "./elo.js";
import { createGoalTable } from "./goal.js";
import { createGameRuleTable } from "./game_rule.js";
import { createPlacementTable } from "./placement.js";


const DB_FILE = "Database.db";
const DB_PATH_FILE = "/app/backups/" + DB_FILE;

async function getDB(): Promise<Database> {
	return open({
		filename: DB_PATH_FILE,
		driver: sqlite3.Database,
	});
}

async function initBallTable(): Promise<void> {
	await createBallTable();
	await insertBalls();
}

async function initMapTable(): Promise<void> {
	await createMapTable();
	await insertMaps();
}

async function initThemeTable(): Promise<void> {
	await createThemeTable();
	await insertThemes();
}

async function initRuleTable(): Promise<void> {
	await createRuleTable();
	await insertRules();
}

function databaseExist(): boolean {
	if (!existsSync(DB_PATH_FILE))
		return false;
	return true;
}

async function initDB(): Promise<void> {
	if (!databaseExist()) {
		// No foreign key.
		await createSeasonTable();
		await initRuleTable();
		await initBallTable();
		await initMapTable();
		await initThemeTable();
		// Foreign key.
		await createUserTable();
		await createFriendshipTable();
		await createGameTable();
		await createGoalTable();
		await createGameRuleTable();
		await createEloTable();
		await createPlacementTable();

		/** @todo gerer ca ailleurs*/
		await insertSeason();
	}
}

export { getDB, initDB };
