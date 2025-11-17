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

async function createUser(user: User): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, pseudo, hashedPassword, ppLink, themeId) VALUES (?, ?, ?, ?, ?)`,
			[user.username, user.pseudo, user.hashedPassword, user.ppLink ?? "NULL", user.themeId]
		), "createUser"
	);
}

async function getAllUsers(): Promise<User[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getUserByUsername(username: string): Promise<User | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE username = ?`,
			[username]
		), "getUserByUsername"
	);
}

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

async function deleteUser(username: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`DELETE FROM ${TABLE_NAME} WHERE username = ?`,
			[username]
		), "deleteUser"
	);
}

export { User };