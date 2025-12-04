import { applyQuery, fetchAll } from "./db_utils.js";

interface Friendship {
	username: string;
	friendName: string;
}

const TABLE_NAME = "Friendship";

async function createFriendshipTable(): Promise<void> {
	applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL,
			friendName TEXT NOT NULL);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function insertFriendship(friendship: Friendship): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, friendName) VALUES (? ,?)`,
			[friendship.username, friendship.friendName]
		), "create" + TABLE_NAME
	);
}

async function isFriendWith(user: string, friend: string): Promise<boolean> {
	return !! await applyQuery(
		async (db) => await db.get(
			`SELECT friendName FROM ${TABLE_NAME}
			WHERE username = ?
			AND friendName = ?`,
			[user, friend]
		), "create" + TABLE_NAME
	);
}

async function addFriendship(user: string, friend: string): Promise<void> {
	console.log(user, friend);
	insertFriendship({ username: user, friendName: friend });
}

async function getAllFriendship(): Promise<Friendship[] | undefined> {
	return fetchAll(TABLE_NAME);
}

async function getFriendships(username: string): Promise<string[] | undefined> {
	const rows = await applyQuery(
		async (db) => await db.all(
			`SELECT friendName FROM ${TABLE_NAME} WHERE username = ?`,
			[username]
		), "get" + TABLE_NAME
	);
	if (!rows)
		return undefined;

	return rows.map(row => row.friendName);
}

async function removeFriendship(username: string, friendName: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`DELETE FROM ${TABLE_NAME}
			WHERE username = ?
			AND friendName = ?`,
			[username, friendName]
		), "delete" + TABLE_NAME
	);
}

export { Friendship, createFriendshipTable, getFriendships, isFriendWith, addFriendship, removeFriendship };
/**
 * @todo see if we keep it
async function updateFriendship(friendName: string, update: Partial<Omit<Friendship, "friendName">>): Promise<void> {
	applyQuery(async (db) => {
		const fields = Object.keys(update).map((k) => `${k} = ?`).join(", ");
		if (!fields) 
			return;
		const values = Object.values(update);
		await db.run(`UPDATE ${TABLE_NAME} SET ${fields} WHERE username = ?`,
			[...values, friendName]);
	}, "updateFriendship");
}
 */
