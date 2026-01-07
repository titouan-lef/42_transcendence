import { getDB } from "./init.js";
import { Database } from "sqlite";

async function applyQuery<T>(queryFunc: (db: Database) => Promise<T>, errorMsg: string ): Promise<T | undefined> {
	let db: Database | null = null;
	try {
		db = await getDB();
		return await queryFunc(db);
	} catch (err) {
		console.error(`Error Database when ${errorMsg} : `, err);
	} finally {
		if (db)
			await db.close();
	}
}

async function fetchAll<T>(tableName: string): Promise<T | undefined> {
	return await applyQuery(
		async (db) => await db.all(
			`SELECT *
			FROM ${tableName}`
		), "getAll" + tableName
	);
}

async function getActualDate(): Promise<Date> {
	const date = await applyQuery(
		async (db) => await db.get(
			`SELECT 
			CURRENT_TIMESTAMP;`
		), "getActualDate"
	);
	return new Date(date.CURRENT_TIMESTAMP);
}

export { applyQuery, getActualDate };
