import { getDB } from "./init.js";
import { Database } from "sqlite";

async function isValidUser(username: string): Promise<boolean> {
	const db: Database = await getDB();

	try {
		const row = await db.get(
			`SELECT username
			FROM User
			WHERE username = ?;`,
			username
		);
		if (row)
			return true;
	} catch (err) {
		console.error("DB error:", err);
	} finally {
		await db.close();
	}
	return false;
}

async function findUserPassword(username: string): Promise<string> {
	const db: Database = await getDB();

	try {
		const row = await db.get(
			`SELECT hashed_password
			FROM User
			WHERE username = ?;`,
			username
		);
		if (row)
			return row.hashed_password ;
	} catch (err) {
		console.error("DB error:", err);
	} finally {
		await db.close();
	}
	return "";
}

export { isValidUser, findUserPassword };