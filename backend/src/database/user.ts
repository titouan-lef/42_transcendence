import { getDB } from "./init.js";

export interface User {
	username: string;
	pseudo: string;
	createdAt?: string; //c est sqlite ou nous gerons cette variable ?
	hashedPassword: string;
	ppLink: string;
	themeId?: number | null;
}

export async function createUser(user: User): Promise<void> {
	const db = await getDB();
	const createAt = new Date().toISOString();
	await db.run(
		`INSERT INTO User (username, pseudo, hashedPassword, ppLink, themeId)
		VALUES (?, ?, ?, ?, ?)`,
		[user.username, user.pseudo, user.hashedPassword, user.ppLink, user.themeId ?? null]
	);
	await db.close();
}

export async function getAllUsers(): Promise<User[]> {
	const db = await getDB();
	const users = await db.all<User[]>(`SELECT * FROM User`);
	await db.close();
	return users;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
	const db = await getDB();
	const user = await db.get<User>(
		`SELECT * FROM User WHERE username = ?`,
		[username]
	);
	await db.close();
	return user;
}

export async function updateUser(
	username: string,
	updates: Partial<Omit<User, "username" | "created_at">>): Promise<void> {
	const db = await getDB();
	const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
	if (!fields) {
		await db.close();
		return;
	}
	const values = Object.values(updates);
	await db.run(
		`UPDATE User SET ${fields} WHERE username = ?`,
		[...values, username]
	);
	await db.close();
}

export async function deleteUser(username: string): Promise<void> {
	const db = await getDB();
	await db.run(`DELETE FROM User WHERE username = ?`, [username]);
	await db.close();
}