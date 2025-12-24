import { getDB } from "./init.js";
import { Database } from "sqlite";

async function applyQuery<T>(queryFunc: (db: Database) => Promise<T>, errorMsg: string ): Promise<T | undefined> {
	const db = await getDB();
	try {
		return await queryFunc(db);
	} catch (err) {
		console.error(`Error Database when ${errorMsg} : `, err);
	} finally {
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
	return await applyQuery(
		async (db) => await db.all(
			`SELECT 
			CURRENT_TIMESTAMP;`
		), "getActualDate"
	);
}

export { applyQuery, fetchAll, getActualDate };
