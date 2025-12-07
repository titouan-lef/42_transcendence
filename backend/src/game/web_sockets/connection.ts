import { FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
import { doesUserExist } from "../../database/user.js";
import { sendReply } from "../../utils/HTTP.js";
import { GameOptions } from "../settings/GameSettings.js";
import { askMatchmakingSystem, isUserWaiting } from "../../tournament/matchmaking.js";
import { GameType, getGameOptions, identifyGame, registerGameOptions } from "../game_manager.js";
import { identifyUser } from "../../JWT.js";

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

//////////////////////////////////////////
//			HTTP routes handeling		//
//////////////////////////////////////////

const TIMEOUT = 10000; // in ms
const SCAN_DELAY = 1000; // in ms

function wait(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function isGameFound(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	if (!isUserWaiting(user)) {
		sendReply(reply, 404, "stop");
		return;
	}

	let waited = 0;
	let id = -1;
	while (id < 0) {
		if (waited >= TIMEOUT) {
			sendReply(reply, 408, "No game found yet"); /**@todo use translate tool */
			return;
		}
		id = await askMatchmakingSystem(user);
		if (id < 0) {
			await wait(SCAN_DELAY);
			waited += SCAN_DELAY;
		}
	}
	sendReply(reply, 200, id.toString());
}

async function newLocalGame(req: FastifyRequest<{ Body: GameOptions }>, reply: FastifyReply): Promise<void> {
	const options: GameOptions = req.body;
	const id = registerGameOptions(options, GameType.LOCAL, []);
	sendReply(reply, 200, id.toString());
}

async function newAIGame(req: FastifyRequest<{ Body: GameOptions }>, reply: FastifyReply): Promise<void> {
	const options: GameOptions = req.body;
	const id = registerGameOptions(options, GameType.AI, []);
	sendReply(reply, 200, id.toString());
}

//////////////////////////////////////////
//		WebSocket management			//
//////////////////////////////////////////

interface GameParams {
	id: number;
}

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
		socket.close(1008, "User not logged in"); /**@todo use translate tool ? */
		return null;
	}
	const user = identifyUser(token);
	if (!await doesUserExist(user)) {
		socket.close(1008, "User does not exist");
		return null;
	}
	return user;
}

async function newGame(socket: WebSocket, req: FastifyRequest<{ Params: GameParams }>): Promise<void> {
	const gameId = Number(req.params.id);
	const gameData = getGameOptions(gameId);
	if (gameData === undefined) {
		socket.close(1003, "Not a valid game id");
		return;
	}
	if (gameData.type === GameType.RANKED) {
		const user = await verifyAuthWS(socket, req);
		if(!user || !gameData.players.includes(user)) {
			socket.close(1003, "You do not belong in this game");
			return;
		}
	}
	startHeartbeat(socket);
	identifyGame(socket, gameId, gameData);
}

export { GameType, isGameFound, newGame, newLocalGame, newAIGame };
