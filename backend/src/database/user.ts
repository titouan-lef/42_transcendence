import { applyQuery, fetchAll } from "./db_utils.js";

const TABLE_NAME = "User";

interface User {
	username: string;
	pseudo: string;
	createdAt: string;
	hashedPassword: string;
	ppLink: string | null;
	themeId: number | null; /** @todo null for the random  or default theme ?*/ 
}

async function createUserTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			username TEXT PRIMARY KEY,
			pseudo TEXT NOT NULL,
			createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
			hashedPassword TEXT NOT NULL,
			ppLink TEXT NOT NULL,
			themeId INTEGER REFERENCES Theme(id));`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertUser(user: User): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, pseudo, hashedPassword, ppLink, themeId) VALUES (?, ?, ?, ?, ?)`,
			[user.username, user.pseudo, user.hashedPassword, user.ppLink ?? "NULL", user.themeId]
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

async function deleteUser(username: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`DELETE FROM ${TABLE_NAME} WHERE username = ?`,
			[username]
		), "delete" + TABLE_NAME
	);
}

export { User, createUserTable };
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