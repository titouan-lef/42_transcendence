import { FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
import { sendReply } from "../utils/reply.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "../user_management/connect_user.js";
import { isValidUser } from "../database/find_data.js";

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

const WAITING_PLAYERS: string[] = [];
const ACTIVES_SOCKETS = new Map<string, WebSocket>();

async function initWebSocketConnection(socket: WebSocket, req: FastifyRequest): Promise<void> {
	console.log("New WebSocket connection");

	const token = req.cookies?.token;
	if (!token)
		return socket.close(1008, "User not logged in");
	let user: string;
	try {
		// eslint-disable-next-line
		const payload: JwtPayload = jwt.verify(token, SECRET) as JwtPayload;
		const exists = await isValidUser(payload.id);
		if (!exists)
			return socket.close(1008, "User does not exist");
		user = payload.id;
		console.log("Identified", user);
		if (ACTIVES_SOCKETS.has(user))
			return socket.close(1008, "Already looking for a game");
		ACTIVES_SOCKETS.set(user, socket);
	} catch {
		return socket.close(1008, "Invalid token");
	}

	socket.on("message", (message: Buffer | string) => {
		console.log("Received message from", user, ":", message.toString());
		socket.send("Hello Fastify WebSockets"); /** @todo handler for the game */
	});

	socket.on("close", () => {
		if (user) {
			ACTIVES_SOCKETS.delete(user);
			console.log("WebSocket connection closed for", user);
		} else {
			console.log("WebSocket closed before identification");
		}
	});
}

function newGame(player1: string, player2: string): void {
	console.log(`New game with ${player1} et ${player2}`);
	const socket1 = ACTIVES_SOCKETS.get(player1);
	const socket2 = ACTIVES_SOCKETS.get(player2);

	if (!socket1 || !socket2)
		return console.error("One of the players is no longer connected.");

	socket1.send("Game begins");
	socket2.send("Game begins");

	// create a new game with Tim work
}

async function joinGame(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return sendReply(reply, 401, false, "User not loged in");

	if (!ACTIVES_SOCKETS.get(user))
		return sendReply(reply, 401, false, "User not connected with a WebSocket");

	if (WAITING_PLAYERS.includes(user))
		return sendReply(reply, 401, false, "Already looking for a game");

	WAITING_PLAYERS.push(user);
	console.log(user, "is waiting for a game");

	if (WAITING_PLAYERS.length >= 2) { /** @todo real match making system */
		const [players1, players2] = WAITING_PLAYERS.splice(0, 2);
		newGame(players1, players2);
	}
	return sendReply(reply, 200, true, "Added to waiting list");
}

export { joinGame, initWebSocketConnection };