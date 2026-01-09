import { FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
import { doesUserExist } from "../../database/user.js";
import { identifyUser, UserIdentity } from "../../security/JWT.js";
import { addPlayerToMatchmakingSystem, isUserWaiting, removePlayerFromMatchmakingSystem } from "../../tournament/matchmaking/matchmaking.js";
import { sendReply } from "../../utils/HTTP.js";
import { GameOptions } from "../settings/GameSettings.js";
import { GameType, getGameOptions, identifyGame, isUserPlaying, registerGameOptions } from "../game_manager.js";
import { Success } from "#shared/status_codes.js";
import { GUEST_NAME } from "../../user_management/create_account.js";

declare module 'fastify' {
	interface FastifyRequest {
		user?: string;
	}
}

//////////////////////////////////////////
//			HTTP routes handeling		//
//////////////////////////////////////////

async function newLocalGame(req: FastifyRequest<{ Body: GameOptions }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const options: GameOptions = req.body;
	const id = registerGameOptions(options, GameType.LOCAL, [user, "player2"]);
	sendReply(reply, Success.GAME_FOUND, id.toString());
}

async function newAIGame(req: FastifyRequest<{ Body: GameOptions }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const options: GameOptions = req.body;
	const id = registerGameOptions(options, GameType.AI, [user, "AI"]);
	sendReply(reply, Success.GAME_FOUND, id.toString());
}

//////////////////////////////////////////
//		WebSocket management			//
//////////////////////////////////////////

interface GameParams {
	id: number;
}

async function waitForGame(socket: WebSocket, req: FastifyRequest): Promise<void> {
	const playerId = await verifyAuthWS(socket, req);
	if (!playerId) {
		socket.close(1003, "You are not connected");
		return;
	}
	if (isUserWaiting(playerId)) {
		socket.close(1003, "You are already looking for a game");
		return;
	}
	if (isUserPlaying(playerId)) {
		socket.close(1003, "You are already in a game");
		return;
	}
	console.log(`${playerId} is wating for a game`);
	socket.on("message", async (message: Buffer) => {
		let options: GameOptions;
		try {
			options = JSON.parse(message.toString());
		} catch {
			socket.close(1003, "Invalid game options");
			return;
		}
		addPlayerToMatchmakingSystem(socket, playerId, options);
	});
	startHeartbeat(socket);
	socket.on("close", () => removePlayerFromMatchmakingSystem(playerId));
}

async function verifyAuthWS(socket: WebSocket, req: FastifyRequest): Promise<string | null> {
	const token = req.cookies?.token;
	if (!token) {
		socket.close(1008, "User not logged in");
		return null;
	}
	let user: UserIdentity;
	let id: string;
	try {
		user = identifyUser(token);
		if (user.username === GUEST_NAME)
			id = String(user.guestId);
		else
			id = user.username;
	} catch {
		socket.close(1008, "Please connect");
		return null;
	}
	if (!await doesUserExist(user.username)) {
		socket.close(1008, "User does not exist");
		return null;
	}
	return id;
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

async function newGame(socket: WebSocket, req: FastifyRequest<{ Params: GameParams }>): Promise<void> {
	const gameId = Number(req.params.id);
	const gameData = getGameOptions(gameId);
	if (gameData === undefined) {
		socket.close(1003, "Not a valid game id");
		return;
	}
	if (gameData.type === GameType.RANKED) {
		const user = await verifyAuthWS(socket, req);
		if (!user || !gameData.players.includes(user)) {
			socket.close(1003, "You do not belong in this game");
			return;
		}
	}
	startHeartbeat(socket);
	identifyGame(socket, gameId, gameData);
}

export { GameType, waitForGame, newGame, newLocalGame, newAIGame, verifyAuthWS };
