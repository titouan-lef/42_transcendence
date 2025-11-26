import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "../user_management/connect_user.js";
import { startGame } from "../game/new_game.js";
import { doesUserExist } from "../database/user.js";
import { SECRET } from "../../user_management/connect_user.js";
import { startGame } from "../game_manager.js";

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

const WAITING_PLAYERS: string[] = [];
const ACTIVES_SOCKETS = new Map<string, WebSocket>();
const LOCAL_GAMES = new Map<string, WebSocket>();

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

async function verifyAuthWS(socket: WebSocket, req: FastifyRequest): Promise<string | null> {
	const token = req.cookies?.token;
	if (!token) {
		socket.close(1008, "User not logged in");
		return null;
	}
	// eslint-disable-next-line
	const payload: JwtPayload = jwt.verify(token, SECRET) as JwtPayload;
	if (!payload) {
		socket.close(1008, "Invalid token");
		return null;
	}
	if (!await doesUserExist(payload.id)) {
		socket.close(1008, "User does not exist");
		return null;
	}
	const user = payload.id;
	if (ACTIVES_SOCKETS.has(user)) {
		socket.close(1008, "Already playing");
		return null;
	}
	if (WAITING_PLAYERS.includes(user)) {
		socket.close(1008, "Already looking for a game");
		return null;
	}
	return user;
}

async function findLocalGame(socket: WebSocket, req: FastifyRequest): Promise<void> {
	console.log("New WebSocket connection for local game"); /** @todo remove */

	startHeartbeat(socket);

	socket.once("message", (message) => {
		let id;
		try {
			id = JSON.parse(message.toString()).id;
		} catch {
			return;
		}
		if (!id)
			return;
		const player1 = LOCAL_GAMES.get(id);
		if (!player1) {
			LOCAL_GAMES.set(id, socket);
			return;
		}
		const player2 = socket;
		LOCAL_GAMES.delete(id);

		startGame("Player 1", player1, "Player 2", player2);
		console.log("New local game");
	});
}

async function localGameVsAI(socket: WebSocket, req: FastifyRequest): Promise<void> {
	console.log("New WebSocket connection for local game vs AI"); /** @todo remove */

	startHeartbeat(socket);

	startGame("Player 1", socket);
}

async function findRankedGame(socket: WebSocket, req: FastifyRequest): Promise<void> {
	console.log("New WebSocket connection"); /** @todo remove */
	const user = await verifyAuthWS(socket, req);
	if (!user)
		return;
	console.log("Identified", user);
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
	startGame(player1, socket1, player2, socket2);
}

export { findRankedGame, findLocalGame, localGameVsAI };
