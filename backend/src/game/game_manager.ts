import { setGameDuration } from "../database/game.js";
import { Game } from "./Game.js";
import { GameOptions, GameSettings } from "./settings/GameSettings.js";
import { WebSocket } from "ws";

//////////////////////////////////////////
//			Game management				//
//////////////////////////////////////////

const GAMES = new Map<number, Game>();

function getNewGameId(): number {
	let id = 0;
	while (GAMES.has(id))
		id++;
	return id;
}

async function startGame(id: number, settings: GameSettings): Promise<number> {
	try {
		if (id < 0)
			id = getNewGameId();
		const game = await Game.create(id, settings);
		GAMES.set(id, game);
		console.log('New game:', id);
		game.start();

		return id;
	} catch (e) {
		console.error("Failed to start game:", e);
		return -1; // ou autre code sentinelle
	}
}

async function stopGame(id: number): Promise<void> {
	const game = GAMES.get(id);
	if (!game)
		return;
	await game.stop();
	GAMES.delete(id);
}

//////////////////////////////////////////
//			Game creations				//
//////////////////////////////////////////

enum GameType { RANKED, LOCAL, AI };

interface GameData {
	type: GameType;
	options: GameOptions;
	players: string[];
};

const GAME_SETTINGS = new Map<number, GameData>();

const RANKED_WAITING = new Map<number, WebSocket>();
const LOCAL_GAMES = new Map<number, WebSocket>();

function getGameOptions(gameId: number): GameData | undefined {
	return GAME_SETTINGS.get(gameId);
}

function registerGameOptions(options: GameOptions , type: GameType, players: string[]): number {
	const id = getNewGameId();
	GAME_SETTINGS.set(id, { type: type, options: options, players: players });
	return id;
}

async function localGame(socket: WebSocket, gameId: number, gameData: GameData): Promise<void> {

	const player1 = LOCAL_GAMES.get(gameId);
	if (player1 === undefined) {
		LOCAL_GAMES.set(gameId, socket);
		return;
	}
	const player2 = socket;
	GAME_SETTINGS.delete(gameId);
	LOCAL_GAMES.delete(gameId);
	const settings = new GameSettings(false, gameData.options, player1, gameData.players[0], player2, "Player 2");
	startGame(gameId, settings);
}

async function aiGame(socket: WebSocket, gameId: number, gameData: GameData): Promise<void> {
	GAME_SETTINGS.delete(gameId);
	const settings = new GameSettings(false, gameData.options, socket, gameData.players[0]);
	startGame(gameId, settings);
	console.log("New local game vs AI");
}

async function rankedGame(socket: WebSocket, gameId: number, gameData: GameData): Promise<void> {
	if (!RANKED_WAITING.get(gameId)) {
		RANKED_WAITING.set(gameId, socket);
		return;
	}
	GAME_SETTINGS.delete(gameId);
	const player2 = RANKED_WAITING.get(gameId);
	RANKED_WAITING.delete(gameId);
	const settings = new GameSettings(true, gameData.options, socket, gameData.players[0], player2, gameData.players[1]); /** @todo get real player usernames */
	startGame(gameId, settings);
	console.log("New ranked game");
}

async function identifyGame(socket: WebSocket, gameId: number, gameData: GameData): Promise<void> {
	switch (gameData.type) {
		case GameType.RANKED:
			rankedGame(socket, gameId, gameData);
			break;
		case GameType.LOCAL:
			localGame(socket, gameId, gameData);
			break;
		case GameType.AI:
			aiGame(socket, gameId, gameData);
			break;
		default:
			socket.close(1003, "Not a valid game id");
			break;
	}
}

export { GameType, GameData, registerGameOptions, getGameOptions, identifyGame, stopGame, getNewGameId };
