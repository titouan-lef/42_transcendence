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

/** @todo saparate matchmaking of game management */

enum GameType { RANKED, LOCAL, AI };

interface GameData {
	type: GameType;
	options: GameOptions;
};

const GAME_SETTINGS = new Map<number, GameData>();

const WAITING_PLAYERS: string[] = [];
const RANKED_WAITING = new Map<number, WebSocket>();
const LOCAL_GAMES = new Map<number, WebSocket>();

//////////////////////////////////////////
//			Stupid matchmaking			//
//////////////////////////////////////////

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
		const id = await registerGameOptions(getRandomOptions(), GameType.RANKED);
		// const id = getNewGameId();
		const [player1, player2] = WAITING_PLAYERS.splice(0, 2);
		const enemy = player1 === username ? player2 : player1;
		MATCHS.set(enemy, id);
		// GAME_SETTINGS.set(id, { type: GameType.RANKED, options: getRandomOptions() });
		return id;
	}
	console.log("No game found", MATCHS);
	return (-1);
}

//////////////////////////////////////////
//			HTTP routes handeling		//
//////////////////////////////////////////

async function registerGameOptions(options: GameOptions , type: GameType): Promise<number> {
	const id = getNewGameId();
	GAME_SETTINGS.set(id, { type: type, options: options });
	return id;
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

async function newLocalGame(req: FastifyRequest<{ Body: GameOptions }>, reply: FastifyReply): Promise<void> {
	const options: GameOptions = req.body;
	const id = await registerGameOptions(options, GameType.LOCAL);
	sendReply(reply, 200, true, id.toString());
}

async function newAIGame(req: FastifyRequest<{ Body: GameOptions }>, reply: FastifyReply): Promise<void> {
	const options: GameOptions = req.body;
	const id = await registerGameOptions(options, GameType.AI);
	sendReply(reply, 200, true, id.toString());
}

//////////////////////////////////////////
//			New game creations			//
//////////////////////////////////////////

async function localGame(socket: WebSocket, gameId: number): Promise<void> {
	
	const options = GAME_SETTINGS.get(gameId)?.options;
	if (options === undefined) {
		socket.close(1003, "Not a valid game id");
		return;
	}

	const player1 = LOCAL_GAMES.get(gameId);
	if (player1 === undefined) {
		LOCAL_GAMES.set(gameId, socket);
		return;
	}
	const player2 = socket;
	GAME_SETTINGS.delete(gameId);
	LOCAL_GAMES.delete(gameId);

	const settings = new GameSettings(options, player1, "Player 1", player2, "Player 2");
	startGame(gameId, settings);
}

async function aiGame(socket: WebSocket, gameId: number): Promise<void> {

	const options = GAME_SETTINGS.get(gameId)?.options;
	if (options === undefined) {
		socket.close(1003, "Not a valid game id");
		return;
	}
	GAME_SETTINGS.delete(gameId);

	startHeartbeat(socket);

	const settings = new GameSettings(options, socket, "Player 1");
	startGame(gameId, settings);
	console.log("New local game vs AI");
}

async function rankedGame(socket: WebSocket, gameId: number): Promise<void> {
	if (!RANKED_WAITING.get(gameId)) {
		RANKED_WAITING.set(gameId, socket);
		return;
	}
	const options = GAME_SETTINGS.get(gameId)?.options;
	if (options === undefined) {
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

async function identifyGame(socket: WebSocket, gameId: number): Promise<void> {
	const type = GAME_SETTINGS.get(gameId)?.type;
	switch (type) {
		case GameType.RANKED:
			rankedGame(socket, gameId);
			break;
		case GameType.LOCAL:
			localGame(socket, gameId);
			break;
		case GameType.AI:
			aiGame(socket, gameId);
			break;
		default:
			socket.close(1003, "Not a valid game id");
			break;
	}
}

async function newGame(socket: WebSocket, req: FastifyRequest<{ Params: GameParams }>): Promise<void> {
	const gameId = Number(req.params.id);
	/** @todo check that this game is for this user */
	startHeartbeat(socket);
	identifyGame(socket, gameId);
}

export { addPlayerToMatchmakingSystem, isGameFound, newGame, newLocalGame, newAIGame };
