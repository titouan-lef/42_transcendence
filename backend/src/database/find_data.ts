import {getDb} from "./init.js";
import { Database } from "sqlite";

export async function findUserPassword(id: string): Promise<string> {
	const db: Database = await getDb();

	try {
		const row = await db.get(
			`SELECT hashedPassword FROM users
			WHERE id = ?;`,
			id
		);
		if (row)
			return row.hashedPassword ;
	} catch (err){
		console.error("DB error:", err);
	} finally {
		await db.close();
	}
	return "";
}
