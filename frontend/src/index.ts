import fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";

const IP = process.env.IP || "localhost";

const APP = fastify();

APP.get("/config.js", (req: FastifyRequest, reply: FastifyReply) => {
	const apiUrl =`https://${IP}:8888`;
	const wsUrl =`wss://${IP}:8888/ws`;
	reply.type("application/javascript").send(`
		window.API_URL = "${apiUrl}";
		window.WS_URL = "${wsUrl}";
	`);
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

// --- Start server ---
async function start(): Promise<void> {
	try {
		console.log(`Frontend running !`);
		await APP.listen({ port: 3030, host: "0.0.0.0" });
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();