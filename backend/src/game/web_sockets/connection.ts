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
const RANKED_WAITING = new Map<number, WebSocket>();
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
	return payload.id;
}

async function localGame(socket: WebSocket, req: FastifyRequest): Promise<void> {
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

async function addPlayerToMatchmakingSystem(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	if (WAITING_PLAYERS.includes(user)) {
		sendReply(reply, 200, true, "Already for a game");
		return ;
	}
	WAITING_PLAYERS.push(user);
	sendReply(reply, 200, true, "Looking for a game");
	console.log(user, "is waiting for a game"); /** @todo remove */
}

function wait(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const MATCHS = new Map<string, number>();

/** stupid matchmaking */
async function askMatchmakingSystem(username: string): Promise<number> {
	console.log("look for", username);
	const id = MATCHS.get(username);
	if (id !== undefined) {
		MATCHS.delete(username);
		return id;
	}
	if (WAITING_PLAYERS.length >= 2) {
		console.log("New game found", MATCHS);
		const id = getNewGameId();
		const [player1, player2] = WAITING_PLAYERS.splice(0, 2);
		const enemy = player1 === username ? player2 : player1;
		MATCHS.set(enemy, id);
		GAME_SETTINGS.set(id, getRandomOptions());
		return id;
	}
	console.log("No game found", MATCHS);
	return (-1);
}

async function isGameFound(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	if (!WAITING_PLAYERS.includes(user) && !MATCHS.has(user)) {
		sendReply(reply, 501, false, "stop"); /** @todo check error code */
		return;
	}

	let waited = 0;
	const timeout = 10000;
	let id = -1;
	while (id < 0) {
		if (waited >= timeout) {
			sendReply(reply, 500, false, "No game found yet"); /** @todo check error code but not the same as before */
			return;
		}
		id = await askMatchmakingSystem(user);
		if (id < 0) {
			await wait(1000);
			waited += 1000;
		}
	}
	sendReply(reply, 200, true, id.toString());
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

interface GameParams {
	id: number;
}

async function rankedGame(socket: WebSocket, req: FastifyRequest<{ Params: GameParams }>): Promise<void> {
	const gameId = Number(req.params.id);
	console.log('New player in game', gameId);
	/** @todo check that this game is for this user */
	startHeartbeat(socket);
	if (!RANKED_WAITING.get(gameId)) {
		RANKED_WAITING.set(gameId, socket);
		return;
	}
	const options = GAME_SETTINGS.get(gameId);
	if (options === undefined) {
		console.log('Not a valid game id: ', gameId);
		socket.close(1003, "Not a valid game id");
		return;
	}
	GAME_SETTINGS.delete(gameId);
	const player2 = RANKED_WAITING.get(gameId);
	RANKED_WAITING.delete(gameId);
	const settings = new GameSettings(options, socket, "Player 1", player2, "Player 2"); /** @todo get real player usernames */
	startGame(gameId, settings);
	console.log("New ranked game");
}

export { registerGameOptions, addPlayerToMatchmakingSystem, isGameFound, rankedGame, localGame, localGameVsAI };
