import sqlite3 from "sqlite3";
import { existsSync } from "fs";
import { open, Database } from "sqlite";
import { createThemeTable, insertTheme } from "./theme.js";
import { createUserTable } from "./user.js";
import { createFriendshipTable } from "./friendship.js";
import { createSeasonTable, insertSeason } from "./season.js";
import { createMapTable, insertMap } from "./map.js";
import { createRuleTable, insertRule } from "./rule.js";
import { createBallTable, insertBall } from "./ball.js";
import { createGameTable } from "./game.js";
import { createEloTable } from "./elo.js";
import { createGoalTable } from "./goal.js";
import { createGameRuleTable } from "./game_rule.js";
import { getElo, setElo, Elo, setRatingDeviation, setRating } from "./web3/contract_service.js";

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
	await insertBall("default");
	await insertBall("invisible");
	await insertBall("pulse");
	await insertBall("snake");
	await insertBall("tricky");
}

async function initMapTable(): Promise<void> {
	await createMapTable();
	await insertMap("default");
	await insertMap("desert");
	await insertMap("sky");
	await insertMap("volcano");
}

async function initThemeTable(): Promise<void> {
	await createThemeTable();
	await insertTheme("pizza_lulu");
	await insertTheme("over_titouan");
	await insertTheme("sugar_rushtman");
	await insertTheme("polybius");
	await insertTheme("neon_hearts");
	await insertTheme("claw_machine");
	await insertTheme("lazer_tim");
	await insertTheme("electronic_eclypse");
	await insertTheme("please_insert_25c");
	await insertTheme("ticket_muncher");
	await insertTheme("electric_pl");
	await insertTheme("monq");
}

async function initRuleTable(): Promise<void> {
	await createRuleTable();
	await insertRule("spin");
	await insertRule("rotate");
	await insertRule("canonCount");
	await insertRule("dash");
	await insertRule("wind");
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

		/** @todo gerer ca ailleurs*/
		await insertSeason();
	}
	await setElo("pchalmin", 1, 1400, 467.8367);
	const elo: Elo = await getElo("pchalmin", 1);
	console.log(`test : ${elo.rating}, ${elo.ratingDeviation}`);
	await setRatingDeviation("pchalmin", 1, 200.254675);
	await setRating("pchalmin", 1, 1800);
	const elo2: Elo = await getElo("pchalmin", 1);
	console.log(`test : ${elo2.rating}, ${elo2.ratingDeviation}`);
}

export { getDB, initDB };
