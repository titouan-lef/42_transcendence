import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "../user_management/connect_user.js";
import { isValidUser } from "../database/find_data.js";
import { startGame } from "../game/new_game.js";

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

const WAITING_PLAYERS: string[] = [];
const ACTIVES_SOCKETS = new Map<string, WebSocket>();

/**
 * Ping the socket if he send no data for 30 seconds, to keep it alive
 */
function startHeartbeat(socket: WebSocket): void {
	let lastActivity = Date.now();

	// update last activity whenever something is received
	socket.on("message", () => {
		lastActivity = Date.now();
	});

	const timer = setInterval(() => {
		const idleTime = Date.now() - lastActivity;
		socket.ping();
	}, 10000); // check every 10 seconds

	socket.on("close", () => clearInterval(timer));
}

async function initWebSocketConnection(socket: WebSocket, req: FastifyRequest): Promise<void> {
	console.log("New WebSocket connection"); /** @todo remove */

	const token = req.cookies?.token;
	if (!token)
		return socket.close(1008, "User not logged in");
	// eslint-disable-next-line
	const payload: JwtPayload = jwt.verify(token, SECRET) as JwtPayload;
	if (!payload)
		return socket.close(1008, "Invalid token");
	const exists = await isValidUser(payload.id);
	if (!exists)
		return socket.close(1008, "User does not exist");
	const user = payload.id;
	console.log("Identified", user);
	if (ACTIVES_SOCKETS.has(user))
		return socket.close(1008, "Already playing");
	if (WAITING_PLAYERS.includes(user))
		return socket.close(1008, "Already looking for a game");
	ACTIVES_SOCKETS.set(user, socket);
	WAITING_PLAYERS.push(user);
	console.log(user, "is waiting for a game"); /** @todo remove */

	startHeartbeat(socket);

	if (WAITING_PLAYERS.length >= 2) { /** @todo real match making system */
		const [players1, players2] = WAITING_PLAYERS.splice(0, 2);
		newGame(players1, players2);
	}

	socket.on("close", () => {
		ACTIVES_SOCKETS.delete(user);
		const index = WAITING_PLAYERS.indexOf(user);
		if (index !== -1)
			WAITING_PLAYERS.splice(index, 1);
	});
}

function newGame(player1: string, player2: string): void {
	console.log(`New game with ${player1} et ${player2}`); /** @todo remove */
	const socket1 = ACTIVES_SOCKETS.get(player1);
	const socket2 = ACTIVES_SOCKETS.get(player2);

	if (!socket1 || !socket2) {
		if (!socket1)
			WAITING_PLAYERS.push(player2);
		else
			WAITING_PLAYERS.push(player1);
		return console.error("One of the players is no longer connected.");
	}
	startGame(player1, player2, socket1, socket2);
}

export { initWebSocketConnection };
