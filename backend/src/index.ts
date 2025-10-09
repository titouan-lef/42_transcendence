import fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyCors from "@fastify/cors";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

const APP = fastify();

let db : Database;

/**
* Cross-Origin Resource Sharing, is a security mechanism implemented by web browsers
*   to control how resources on a web server can be requested from a domain 
*   other than the one serving the web page.
* Without CORS, a browser would block frontend apps from calling the backend.
*/

APP.register(fastifyCors, { origin: "*" });

declare module "fastify" {
	interface FastifyRequest {
		logData: {
			method: string;
			url: string;
			query: string;
			body: string;
		};
	}
}

// --- Database setup ---
async function initDB(): Promise<void> {
	db = await open({
		filename: "requests.db",
		driver: sqlite3.Database
	});

	// Create table for logging requests and responses
	await db.exec(`
		CREATE TABLE IF NOT EXISTS logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			method TEXT,
			url TEXT,
			query_params TEXT,
			body TEXT,
			response TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);
}

// --- Logging hooks ---
APP.addHook("onRequest", async (req: FastifyRequest, reply: FastifyReply) => {
	// Temporarily store request info
	req.logData = {
		method: req.method,
		url: req.url,
		query: JSON.stringify(req.query),
		body: JSON.stringify(req.body)
	};
});

APP.addHook("onSend", async (req: FastifyRequest, reply: FastifyReply, payload: Buffer) => {
	// Save request + response to DB
	await db.run(
		`INSERT INTO logs (method, url, query_params, body, response) VALUES (?, ?, ?, ?, ?)`,
		req.logData.method,
		req.logData.url,
		req.logData.query,
		req.logData.body,
		payload.toString()
	);
	return payload;
});

// --- Route handlers ---
interface HelloResponse {
	msg: string;
}

async function helloHandler(): Promise<HelloResponse> {
	return { msg: "Hello world !" };
}

async function testHandler(): Promise<HelloResponse> {
	return { msg: "Fuck you Tony !" };
}

APP.get("/api/hello", helloHandler);
APP.get("/api/test", testHandler);

// --- Start server ---
async function start(): Promise<void> {
	try {
		await initDB(); // initialize DB before server
		await APP.listen({ port: 3000, host: "0.0.0.0" });
	} catch (err) {
		APP.log.error(err);
		process.exit(1);
	}
};

start();