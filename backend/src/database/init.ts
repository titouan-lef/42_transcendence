import sqlite3 from "sqlite3";
import { existsSync } from "fs";
import { open, Database } from "sqlite";
import { createThemeTable, insertThemes } from "./theme.js";
import { createUserTable, insertGuest } from "./user.js";
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
import { hashString } from "../utils/hash_string.js";
import { applyQuery } from "./db_utils.js";

const DB_FILE = "Database.db";
const DB_PATH_FILE = "/app/backups/" + DB_FILE;

const SEASON_DURATION = 60 * 60 * 1000; // 1 h in ms

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

async function seasonManagement(): Promise<void> {
	setInterval(insertSeason, SEASON_DURATION);
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

		await insertSeason();
		await insertGuest();
	}
	seasonManagement();

	const mdpp = hashString('pl');
	const mdpl = hashString('l');
	const mdpm = hashString('m');
	await applyQuery(
		async (db) => await db.exec(
			`
			DELETE FROM Elo;
			DELETE FROM Goal;
			DELETE FROM Game;
			DELETE FROM Season;
			-- On utilise OR IGNORE pour ne pas bloquer si l'ID existe déjà
			INSERT OR IGNORE INTO User (username, pseudo, hashedPassword, is2FAEnabled, themeId) VALUES 
			('pl', 'p', '${mdpp}', false, NULL),
			('l', 'l', '${mdpl}', false, NULL),
			('m', 'm', '${mdpm}', false, NULL);

			INSERT OR IGNORE INTO Season (id, startedAt) VALUES
			('1', '2025-12-01 12:20:13'),
			('2', '2025-12-05 12:20:13'),
			('3', '2025-12-10 12:20:13');
			INSERT OR IGNORE INTO Game (id, beganAt, duration, seasonId) VALUES
			('1', '2025-12-01 12:20:13', '20', '1'),
			('2', '2025-12-02 12:20:13', '20', '1'),
			('3', '2025-12-02 12:20:13', '20', '1'),
			('4', '2025-12-15 12:20:13', '20', '4'),
			('5', '2025-12-16 12:20:13', '20', '4'),
			('6', '2025-12-17 12:20:13', '20', '4');
			-- Note: Pour Elo et Goal, si vous n'avez pas de clé primaire unique 
			-- sur (username, gameId), un simple INSERT suffit.
			INSERT INTO Elo (username, gameId, variation) VALUES
			('pl', '1', '10'), ('l', '1', '-20'),
			('pl', '2', '20'), ('l', '2', '-30'),
			('pl', '3', '-30'), ('l', '3', '40'),
			('pl', '4', '40'), ('l', '4', '-50'),
			('l', '5', '5'),  ('m', '5', '-6'),
			('m', '6', '-2');
			INSERT INTO Goal (mapId, ballId, gameId, scoredAt, by) VALUES 
			-- Game 1
			(1, 1, 1, 1, 'pl'), (1, 1, 1, 1, 'pl'), (1, 1, 1, 1, 'pl'),
			(1, 1, 1, 1, 'pl'), (1, 1, 1, 1, 'pl'), (1, 1, 1, 1, 'pl'),
			(1, 1, 1, 1, 'pl'), (1, 1, 1, 1, 'pl'), (1, 1, 1, 1, 'pl'),
			(1, 1, 1, 1, 'pl'), (1, 1, 1, 1, 'pl'),
			-- Game 2
			(2, 1, 2, 1, 'pl'), (2, 1, 2, 1, 'pl'), (2, 1, 2, 1, 'pl'),
			(2, 1, 2, 1, 'pl'), (2, 1, 2, 1, 'pl'), (2, 1, 2, 1, 'pl'),
			(2, 1, 2, 1, 'pl'), (2, 1, 2, 1, 'pl'), (2, 1, 2, 1, 'pl'),
			(2, 1, 2, 1, 'pl'), (2, 1, 2, 1, 'pl'),
			-- Game 3
			(3, 1, 3, 1, 'l'), (3, 1, 3, 1, 'l'), (3, 1, 3, 1, 'l'),
			(3, 1, 3, 1, 'l'), (3, 1, 3, 1, 'l'), (3, 1, 3, 1, 'l'),
			(3, 1, 3, 1, 'l'), (3, 1, 3, 1, 'l'), (3, 1, 3, 1, 'l'),
			(3, 1, 3, 1, 'l'), (3, 1, 3, 1, 'l');`
		), "insert"
	);
}

export { getDB, initDB };
