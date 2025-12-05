import { applyQuery, fetchAll } from "./db_utils.js";

interface User {
	username: string;
	pseudo: string;
	createdAt: string;
	hashedPassword: string;
	avatar: string | null;
	themeId: number | null; /** @todo null for the random or default theme ?*/ 
}

const TABLE_NAME = "User";
const DEFAULT_AVATAR = "";/**@todo to complete*/
const DEFAULT_THEME = "";/**@todo to complete*/

async function createUserTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			username TEXT PRIMARY KEY,
			pseudo TEXT NOT NULL,
			createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			hashedPassword TEXT NOT NULL,
			avatar TEXT NOT NULL,
			themeId INTEGER REFERENCES Theme(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertUser(username: string, pseudo: string, hashedPassword: string): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, pseudo, hashedPassword, avatar, themeId) VALUES (?, ?, ?, ?, ?)`,
			[username, pseudo, hashedPassword, DEFAULT_AVATAR, DEFAULT_THEME]
		), "insert" + TABLE_NAME
	);
}

async function getAllUser(): Promise<User[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getUserByUsername(username: string): Promise<User | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE username = ?`,
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
			`SELECT hashedPassword FROM ${TABLE_NAME} WHERE username = ?;`,
			[username]
		), "get" + TABLE_NAME + "Password"
	);
	return row?.hashedPassword ?? "";
}

async function changeUserPicture(username: string, avatar:string): Promise<void> {
	await applyQuery(
		async (db) => await db.get(
			`UPDATE ${TABLE_NAME}
			SET avatar = ?
			WHERE username = ?;`,
			[avatar, username]
		), "get" + TABLE_NAME + "Picture"
	);
}

async function getUserPicture(username: string): Promise<string | undefined> {
	const row = await applyQuery(
		async (db) => await db.get(
			`SELECT avatar FROM ${TABLE_NAME}
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

export { User, createUserTable, getUserPassword, doesUserExist, insertUser, changeUserPicture, getUserPicture };
/**
 * 
 * @todo will be used, but must be modified
 * 
async function updateUser(username: string, updates: Partial<Omit<User, "username" | "createdAt">>): Promise<void> {
	applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
		return;
		const values = Object.values(updates);
		await db.run(`UPDATE ${TABLE_NAME} SET ${fields} WHERE username = ?`,[...values, username,]);
	}, "updateUser");
}
*/
