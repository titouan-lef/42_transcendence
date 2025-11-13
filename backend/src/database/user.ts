import { applyQuery } from "./db_utils.js";

export interface User {
	username: string;
	pseudo: string;
	createdAt?: string;
	hashedPassword: string;
	ppLink: string;
	themeId: number | null;
}

export async function createUser(user: User): Promise<void> {
	applyQuery(async (db) => await db.run(
		`INSERT INTO User (username, pseudo, hashedPassword, ppLink, themeId) VALUES (?, ?, ?, ?, ?)`,
		[user.username, user.pseudo, user.hashedPassword, user.ppLink, user.themeId]
	), "createUser");
}

export async function getAllUsers(): Promise<User[] | undefined> {
	return applyQuery(async (db) => await db.all(`SELECT * FROM User`), "getAllUser");
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
	return applyQuery(async (db) => await db.get(
		`SELECT * FROM User WHERE username = ?`,
		[username]), "getUserByUsername");
}

export async function updateUser(username: string, updates: Partial<Omit<User, "username" | "createdAt">>): Promise<void> {
	applyQuery(async (db) => {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
			return;
		const values = Object.values(updates);
		await db.run(`UPDATE User SET ${fields} WHERE username = ?`,[...values, username,]);
	}, "updateUser");
}

export async function deleteUser(username: string): Promise<void> {
	applyQuery(async (db) => await db.run(`DELETE FROM User WHERE username = ?`, [username]), "deleteUser");
}
