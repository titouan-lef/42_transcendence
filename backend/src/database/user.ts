import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "User";

interface User {
	username: string;
	pseudo: string;
	createdAt?: string;
	hashedPassword: string;
	ppLink: string;
	themeId: number | null;
}

async function createUser(user: User): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO ${TABLE_NAME} (username, pseudo, hashedPassword, ppLink, themeId) VALUES (?, ?, ?, ?, ?)`,
		[user.username, user.pseudo, user.hashedPassword, user.ppLink, user.themeId]
	), "createUser");
}

async function getAllUsers(): Promise<User[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM User`), "getAllUser");
}

async function getUserByUsername(username: string): Promise<User | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM ${TABLE_NAME} WHERE username = ?`,
		[username]), "getUserByUsername");
}

async function updateUser(username: string, updates: Partial<Omit<User, "username" | "createdAt">>): Promise<void> {
	applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
			return;
		const values = Object.values(updates);
		await db.run(`UPDATE ${TABLE_NAME} SET ${fields} WHERE username = ?`,[...values, username,]);
	}, "updateUser");
}

async function deleteUser(username: string): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM ${TABLE_NAME} WHERE username = ?`, [username]), "deleteUser");
}
