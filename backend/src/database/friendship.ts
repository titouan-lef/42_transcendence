import { applyQuery, fetchAll } from "./db_utils.js";

interface Friendship {
	username: string;
	friendName: string;
}

const TABLE_NAME = "Friendship";

async function createFriendshipTable(): Promise<void> {
	await applyQuery(
		async (db) => await db.exec(
			`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			username TEXT NOT NULL,
			friendName TEXT NOT NULL,
			PRIMARY KEY (username, friendName)
			);`
		), "create" + TABLE_NAME + "Table"
	);
}

async function isFriendWith(user: string, friend: string): Promise<boolean> {
	return !! await applyQuery(
		async (db) => await db.get(
			`SELECT friendName
			FROM ${TABLE_NAME}
			WHERE username = ?
			AND friendName = ?`,
			[user, friend]
		), "create" + TABLE_NAME
	);
}

async function addFriendship(user: string, friend: string): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, friendName) VALUES (? ,?)`,
			[user, friend]
		), "create" + TABLE_NAME
	);
}

async function getAllFriendship(): Promise<Friendship[] | undefined> {
	return await fetchAll(TABLE_NAME);
}

interface FriendWithNickname {
	username: string;
	nickname: string;
}

async function getFriendships(username: string): Promise<FriendWithNickname[]> {
	const rows = await applyQuery(
		async (db) =>
			db.all<FriendWithNickname[]>(
				`SELECT
					f.friendName AS username,
					u.nickname
				FROM ${TABLE_NAME} AS f
				JOIN User AS u
					ON u.username = f.friendName
				WHERE f.username = ?
				ORDER BY f.friendName ASC`,
				[username]
			),
		"get" + TABLE_NAME
	);
	if (!rows)
		return [];
	return rows;
}


async function removeFriendship(username: string, friendName: string): Promise<void> {
	await applyQuery(
		async (db) => await db.run(
			`DELETE FROM ${TABLE_NAME}
			WHERE username = ?
			AND friendName = ?`,
			[username, friendName]
		), "delete" + TABLE_NAME
	);
}

export { Friendship, FriendWithNickname, createFriendshipTable, getFriendships, isFriendWith, addFriendship, removeFriendship };
