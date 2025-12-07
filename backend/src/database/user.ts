import { applyQuery, fetchAll } from "./db_utils.js";

interface User {
	username: string;
	pseudo: string;
	createdAt: string;
	hashedPassword: string;
	avatar: string | null;
	themeId: number | null; /** @todo null for the random or default theme ?*/
	/**@todo ADD keybind */
}

const TABLE_NAME = "User";
const DEFAULT_AVATAR = "";/**@todo to complete*/
const DEFAULT_THEME = "";/**@todo to complete*/

async function createUserTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			username TEXT PRIMARY KEY,
			pseudo TEXT NOT NULL,
			createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			hashedPassword TEXT NOT NULL,
			avatar TEXT NOT NULL,
			is2FAEnabled BOOLEAN NOT NULL,
			email TEXT,
			themeId INTEGER REFERENCES Theme(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertUser(username: string, pseudo: string, hashedPassword: string): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, pseudo, hashedPassword, avatar, is2FAEnabled, themeId) VALUES (?, ?, ?, ?, ?, ?)`,
			[username, pseudo, hashedPassword, DEFAULT_AVATAR, false, DEFAULT_THEME]
		), "insert" + TABLE_NAME
	);
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

async function is2FAEnabled(username: string): Promise<string> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT is2FAEnabled FROM ${TABLE_NAME} WHERE username = ?;`,
			[username]
		), "get" + TABLE_NAME + "2FA"
	);
	return row?.is2FAEnabled ?? "";
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

async function changeUserEmail(username: string, email: string): Promise<void> {
	await applyQuery(
		async (db) => await db.get(
			`UPDATE ${TABLE_NAME}
			SET email = ?
			WHERE username = ?;`,
			[email, username]
		), "update" + TABLE_NAME + "Email"
	);
}

async function changeUserPicture(username: string, avatar: string): Promise<void> {
	await applyQuery(
		async (db) => await db.get(
			`UPDATE ${TABLE_NAME}
			SET avatar = ?
			WHERE username = ?;`,
			[avatar, username]
		), "update" + TABLE_NAME + "Picture"
	);
}

async function getUserPicture(username: string): Promise<string | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT avatar
			FROM ${TABLE_NAME}
			WHERE username = ?;`,
			[username]
		), "get" + TABLE_NAME + "Picture"
	);
	return row?.avatar;
}

async function deleteUser(username: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`DELETE FROM ${TABLE_NAME} WHERE username = ?`,
			[username]
		), "delete" + TABLE_NAME
	);
}

/**
 * 
 * @todo will be used, but must be modified
 * 
 */
async function updateUser(username: string, updates: Partial<Omit<User, "username" | "createdAt">>): Promise<void> {
	await applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
			return;
		const values = Object.values(updates);
		await db.run(`UPDATE ${TABLE_NAME} SET ${fields} WHERE username = ?`,[...values, username,]);
	}, "update" + TABLE_NAME);
}

export { User, createUserTable, getUserPassword, doesUserExist, insertUser, updateUser, disabled2FA, enabled2FA, is2FAEnabled, isEmailDefined, changeUserEmail, getUserEmail, changeUserPicture, getUserPicture };
