import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookies from "@fastify/cookie";
import { initDB } from "./database/init.js";
import { addNewUser } from "./user_management/create_account.js";
import { connectUser, disconnectUser, whoami, verifyAuth } from "./user_management/connect_user.js";

const APP = fastify();

/**
* Cross-Origin Resource Sharing, is a security mechanism implemented by web browsers
*   to control how resources on a web server can be requested from a domain 
*   other than the one serving the web page.
* Without CORS, a browser would block frontend apps from calling the backend.
*/

// Since we are now using cookies the line `APP.register(fastifyCors, { origin: "*", credentials: true });` is no more valid
// because the "*" is messing up the cookies so it is now dynamicly allowed
APP.register(fastifyCors, {
	origin: (origin, cb) => cb(null, true), // allow all origins dynamically
	credentials: true, // allow cookies
});
APP.register(fastifyCookies);

// --- Route handlers ---
APP.post("/api/user/new_user", addNewUser);
APP.post("/api/user/login", connectUser);
APP.post("/api/user/logout", { preHandler: verifyAuth }, disconnectUser);
APP.post("/api/user/whoami", { preHandler: verifyAuth }, whoami);

// --- Start server ---
async function start(): Promise<void> {
	try {
		await initDB(); // initialize DB before server
		await APP.listen({ port: 3000, host: "0.0.0.0" });
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();