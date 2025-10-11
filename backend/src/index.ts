import fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyCors from "@fastify/cors";
import { initDB } from "./database/init.js";
import { addNewUser } from "./user_management/create_account.js";

const APP = fastify();

/**
* Cross-Origin Resource Sharing, is a security mechanism implemented by web browsers
*   to control how resources on a web server can be requested from a domain 
*   other than the one serving the web page.
* Without CORS, a browser would block frontend apps from calling the backend.
*/

APP.register(fastifyCors, { origin: "*" });

// --- Route handlers ---
APP.post("/api/user/new_user", addNewUser);

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