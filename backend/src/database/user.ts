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
	try {
		await db.run(
			`INSERT INTO User (username, pseudo, hashedPassword, ppLink, themeId) VALUES (?, ?, ?, ?, ?)`,
			[user.username, user.pseudo, user.hashedPassword, user.ppLink, user.themeId ?? null,]
		);
	} finally {
		await db.close();
	}
}

export async function getAllUsers(): Promise<User[]> {
	const db = await getDB();
	try {
		const users: User[] = await db.all(`SELECT * FROM User`);
		return users;
	} finally {
		await db.close();
	}
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
	const db = await getDB();
	try {
		const user: User = await db.get(`SELECT * FROM User WHERE username = ?`, [username]);
		return user;
	} finally {
		await db.close();
	}
}

export async function updateUser(username: string, updates: Partial<Omit<User, "username" | "created_at">>): Promise<void> {
	const db = await getDB();
	try {
		const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
		if (!fields)
			return;
		const values = Object.values(updates);
		await db.run(`UPDATE User SET ${fields} WHERE username = ?`,[...values, username,]);
	} finally { 
		await db.close();
	}
}

export async function deleteUser(username: string): Promise<void> {
	const db = await getDB();
	try {
		await db.run(`DELETE FROM User WHERE username = ?`, [username]);
	} finally {
		await db.close();
	}
}
