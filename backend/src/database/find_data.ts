import { getDb } from "./init.js";
import { Database } from "sqlite";

export async function findUserPassword(username: string): Promise<string> {
	const db: Database = await getDb();

	try {
		const row = await db.get(
			`SELECT hashed_password FROM User
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
