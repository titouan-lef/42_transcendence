import { hashString } from "../utils/hash_string.js";
import { applyQuery, fetchAll } from "./db_utils.js";

interface User {
	username: string;
	pseudo: string;
	createdAt: string;
	hashedPassword: string;
	is2FAEnabled: boolean;
	themeId: number | null;
	email: string | null;
	/**@todo ADD keybind */
}

const TABLE_NAME = "User";

async function createUserTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			username TEXT PRIMARY KEY,
			pseudo TEXT NOT NULL,
			createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			hashedPassword TEXT NOT NULL,
			is2FAEnabled BOOLEAN NOT NULL,
			email TEXT,
			themeId INTEGER REFERENCES Theme(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertUser(username: string, pseudo: string, hashedPassword: string): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, pseudo, hashedPassword, is2FAEnabled, themeId) VALUES (?, ?, ?, ?, ?)`,
			[username, pseudo, hashedPassword, false, null]
		), "insert" + TABLE_NAME
	);
}

async function insertGuest(): Promise<void> {
	await insertUser('guest', 'guest', hashString(''));
}

async function getAllUser(): Promise<User[] | undefined> {
	return await fetchAll(TABLE_NAME);
}

async function getUserByUsername(username: string): Promise<User | undefined> {
	return await applyQuery(
		async (db) => await db.get(
			`SELECT *
			FROM ${TABLE_NAME}
			WHERE username = ?`,
			[username]
		), "get" + TABLE_NAME + "ByUsername"
	);
}

async function doesUserExist(name: string) : Promise<boolean> {
	return !!(await getUserByUsername(name));
}

async function getUserPassword(username: string): Promise<string> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT hashedPassword
			FROM ${TABLE_NAME}
			WHERE username = ?;`,
			[username]
		), "get" + TABLE_NAME + "Password"
	);
	return row?.hashedPassword ?? "";
}

async function getUserEmail(username: string): Promise<string> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT email FROM ${TABLE_NAME} WHERE username = ?;`,
			[username]
		), "get" + TABLE_NAME + "Email"
	);
	return row?.email ?? "";
}

async function isEmailDefined(username: string): Promise<boolean> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT email FROM ${TABLE_NAME} WHERE username = ?;`,
			[username]
		), "get" + TABLE_NAME + "Email"
	);
	if (row?.email)
		return true;
	return false;
}

async function is2FAEnabled(username: string): Promise<boolean> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT is2FAEnabled FROM ${TABLE_NAME} WHERE username = ?;`,
			[username]
		), "get" + TABLE_NAME + "2FA"
	);
	if (row?.is2FAEnabled)
		return Boolean(row.is2FAEnabled);
	return false;
}

async function update2FA(username: string, value: boolean): Promise<void> {
	await applyQuery(
		async (db) => await db.get(
			`UPDATE ${TABLE_NAME}
			SET is2FAEnabled = ?
			WHERE username = ?;`,
			[value, username]
		), "update" + TABLE_NAME + "Email"
	);
}

async function enabled2FA(username: string): Promise<void> {
	await update2FA(username, true);
}

async function disabled2FA(username: string): Promise<void> {
	await update2FA(username, false);
}

async function deleteUser(username: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`DELETE FROM ${TABLE_NAME} WHERE username = ?`,
			[username]
		), "delete" + TABLE_NAME
	);
}

/** @todo will be used, but must be modified */
async function updatePseudo(username: string, pseudo: string): Promise<void> {
	await applyQuery(async (db) => {
		await db.run(`
			UPDATE ${TABLE_NAME}
			SET pseudo = ?
			WHERE username = ?
			`,[pseudo, username]);
	}, "update" + TABLE_NAME + "Pseudo");
}

async function updatePassword(username: string, hashedPassword: string): Promise<void> {
	await applyQuery(async (db) => {
		await db.run(`
			UPDATE ${TABLE_NAME}
			SET hashedPassword = ?
			WHERE username = ?
			`,[hashedPassword, username]);
	}, "update" + TABLE_NAME + "Password");
}

async function updateEmail(username: string, email: string): Promise<void> {
	await applyQuery(async (db) => {
		await db.run(`
			UPDATE ${TABLE_NAME}
			SET email = ?
			WHERE username = ?
			`,[email, username]);
	}, "update" + TABLE_NAME + "Email");
}

async function updateTheme(username: string, theme: string): Promise<void> {
	await applyQuery(async (db) => {
		await db.run(`
			UPDATE ${TABLE_NAME}
			SET themeId = (
				SELECT id
				FROM Theme
				WHERE name = ?)
			WHERE username = ?
			`,[theme, username]);
	}, "update" + TABLE_NAME + "Theme");
}

export { User, getUserByUsername, createUserTable, getUserPassword, doesUserExist, insertUser, insertGuest, disabled2FA, enabled2FA, getUserEmail };
export { updatePseudo, updatePassword, updateEmail, updateTheme };
export { is2FAEnabled, isEmailDefined };
