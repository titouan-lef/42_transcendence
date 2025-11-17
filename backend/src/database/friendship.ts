import { applyQuery } from "./db_utils.js";

const TABLE_NAME = "Friendship";

interface Friendship {
	username: string;
	friendName: string;
}

async function createFriendship(friendship: Friendship): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`INSERT INTO ${TABLE_NAME} (username, friendName) VALUES (? ,?)`,
			[friendship.username, friendship.friendName]
		), "createFriendship"
	);
}

async function getAllFriendship(): Promise<Friendship[] | undefined> {
	return applyQuery(
		async (db) => await db.all(
			`SELECT * FROM ${TABLE_NAME}`
		), "getAllFriendship"
	);
}

async function getFriendship(username: string): Promise<Friendship | undefined> {
	return applyQuery(
		async (db) => await db.get(
			`SELECT * FROM ${TABLE_NAME} WHERE USERNAME = ?`,
			[username]
		), "getFriendship"
	);	
}

async function deleteFriendship(username: string): Promise<void> {
	applyQuery(
		async (db) => await db.run(
			`DELETE FROM ${TABLE_NAME} WHERE username = ?`,
			[username]
		), "deleteFriendship"
	);
}

export { Friendship };

/**
 * @todo voir si on garde
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