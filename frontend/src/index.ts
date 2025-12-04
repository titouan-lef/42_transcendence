import fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyStatic from "@fastify/static";

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
	root: "/app/dist",
	prefix: "/dist/"
});

APP.register(fastifyStatic, {
	root: "/app/public",
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