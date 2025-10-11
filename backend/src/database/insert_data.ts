import {getDb} from "./init.js";
import { Database } from "sqlite";

export async function insertUser(id: string, pseudo: string, hashedPassword: string, ppLink: string): Promise<void> {
	const db: Database = await getDb();
	const creationDate = new Date().toISOString();

	await db.run(
		`INSERT INTO users (id, pseudo, creation, hashedPassword, ppLink) VALUES (?, ?, ?, ?, ?);`,
		id,
		pseudo,
		creationDate,
		hashedPassword,
		ppLink
	);

	await db.close();
}

