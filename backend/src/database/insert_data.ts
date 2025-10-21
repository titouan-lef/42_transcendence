import { getDB } from "./init.js";
import { Database } from "sqlite";

async function insertUser(username: string, pseudo: string, hashedPassword: string, ppLink: string): Promise<void> {
	const db: Database = await getDB();
	const creationDate = new Date().toISOString();

	await db.run(
		`INSERT INTO User (username, pseudo, created_at, hashed_password, pp_link)
		VALUES (?, ?, ?, ?, ?);`,
		username,
		pseudo,
		creationDate,
		hashedPassword,
		ppLink
	);

	await db.close();
}

export { insertUser };
