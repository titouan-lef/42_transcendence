import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { createThemeTable } from "./theme.js";
import { createUserTable } from "./user.js";
import { createFriendshipTable } from "./friendship.js";
import { createSeasonTable } from "./season.js";
import { createMapTable } from "./map.js";
import { createRuleTable } from "./rule.js";
import { createBallTable } from "./ball.js";
import { createGameTable } from "./game.js";
import { createEloTable } from "./elo.js";
import { createGoalTable } from "./goal.js";
import { createGameRuleTable } from "./game_rule.js";


async function getDB(): Promise<Database> {
	return open({
		filename: "./database.db",
		driver: sqlite3.Database,
	});
}

async function initDB(): Promise<void> {
	createThemeTable();
	createUserTable();
	createFriendshipTable();
	createSeasonTable();
	createMapTable();
	createBallTable();
	createRuleTable();
	createGameTable();
	createGoalTable();
	createGameRuleTable();
	createEloTable();
}

export { getDB, initDB };
