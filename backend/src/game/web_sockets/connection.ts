import { FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { doesUserExist } from "../../database/user.js";
import { SECRET } from "../../user_management/connect_user.js";
import { getNewGameId, startGame } from "../game_manager.js";
import { sendReply } from "../../utils/HTTP.js";
import { GameOptions, GameSettings } from "../settings/GameSettings.js";
import { randomBoolean } from "../utils.js";

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

const GAME_SETTINGS = new Map<number, GameOptions>();

const WAITING_PLAYERS: string[] = [];
const ACTIVES_SOCKETS = new Map<string, WebSocket>();
const LOCAL_GAMES = new Map<number, WebSocket>();

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
		let id: number;
		try {
			id = getGameId(message.toString());
		} catch {
			socket.close(1003, "Invalid message format");
			return;
		}
		const options = GAME_SETTINGS.get(id);
		if (!options) {
			socket.close(1003, "Not a valid game id");
			return;
		}

		const player1 = LOCAL_GAMES.get(id);
		if (!player1) {
			LOCAL_GAMES.set(id, socket);
			return;
		}
		const player2 = socket;
		GAME_SETTINGS.delete(id);
		LOCAL_GAMES.delete(id);

		const settings = new GameSettings(options, player1, "Player 1", player2, "Player 2");
		startGame(id, settings);
	});
}

async function registerGameOptions(req: FastifyRequest<{ Body: GameOptions }>, reply: FastifyReply): Promise<void> {
	const options: GameOptions = req.body;
	const id = getNewGameId();
	GAME_SETTINGS.set(id, options);
	sendReply(reply, 200, true, id.toString());
}

function getGameId(message: string): number {
	const id = JSON.parse(message).id;
	if (id === undefined)
		throw new Error("Invalid body request");
	return id;
}

async function localGameVsAI(socket: WebSocket, req: FastifyRequest): Promise<void> {
	console.log("New WebSocket connection for local game vs AI"); /** @todo remove */

	socket.once("message", (message) => {
		let id: number;
		try {
			id = getGameId(message.toString());
		} catch {
			socket.close(1003, "Invalid message format");
			return;
		}
		const options = GAME_SETTINGS.get(id);
		if (!options) {
			socket.close(1003, "Not a valid game id");
			return;
		}
		GAME_SETTINGS.delete(id);

		startHeartbeat(socket); 

		const settings = new GameSettings(options, socket, "Player 1");
		startGame(id, settings);
		console.log("New local game vs AI");
	});
}

function getRandomOptions(): GameOptions {
	const options: GameOptions = {
		map: "random",
		ball: "random",
		rotatingPlayer: randomBoolean(),
		spin: randomBoolean(),
		windAffectsBall: randomBoolean()
	};
	return options;
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

	const setting = new GameSettings(getRandomOptions(), socket1, player1, socket2, player2);

	startGame(-1, setting);
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

export { registerGameOptions, findRankedGame, findLocalGame, localGameVsAI };
