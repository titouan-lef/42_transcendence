import fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";

const APP = fastify();
const PORT = Number(process.env.PORT) || 80;
const IP = process.env.IP || "localhost";

APP.get("/config.js", (req: FastifyRequest, reply: FastifyReply) => {
	const apiUrl = process.env.API_URL || "http://localhost:3000";
	reply.type("application/javascript").send(`window.API_URL = "${apiUrl}";`);
});

// Serve static files
APP.register(fastifyStatic, {
	root: path.join("/app/dist"),
	prefix: "/dist/"
});

APP.register(fastifyStatic, {
	root: path.join("/app/public"),
	prefix: "/",
	decorateReply: false,
	index: ["index.html"]
});

// --- Routes ---

function consoleLinks(): void {
	console.log(`Frontend running at:`);
	console.log(` - Local:   http://localhost:${PORT}`);
	console.log(` - Network: http://${IP}:${PORT}`);
}

// --- Start server ---
async function start(): Promise<void> {
	try {
		consoleLinks();
		await APP.listen({ port: PORT, host: "0.0.0.0" });
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();