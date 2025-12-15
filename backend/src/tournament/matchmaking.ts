import { FastifyRequest, FastifyReply } from "fastify";
import { GameType } from "../game/web_sockets/connection.js";
import { sendReply } from "../utils/HTTP.js";
import { GameOptions } from "../game/settings/GameSettings.js";
import { registerGameOptions } from "../game/game_manager.js";
import { Errors, Success } from "../utils/status_codes.js";

interface WaitingPlayer {
	username: string;
	options: GameOptions;
}
const WAITING_PLAYERS: WaitingPlayer[] = [];
const MATCHS = new Map<string, number>();

function isUserWaiting(user: string) : boolean {
	return (WAITING_PLAYERS.find(p => p.username === user) !== undefined) || MATCHS.has(user);
}

async function addPlayerToMatchmakingSystem(req: FastifyRequest<{ Body: GameOptions }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	const options: GameOptions = req.body;
	if (!user || !options)
		return;
	if (isUserWaiting(user)) {
		sendReply(reply, Errors.ALREADY_IN_QUEUE);
		return;
	}
	const newWaitingPlayer = {
		username: user,
		options: options
	};
	WAITING_PLAYERS.push(newWaitingPlayer);
	sendReply(reply, Success.ADDED_TO_QUEUE);
}

function getRandomOptions(player1Options: GameOptions, player2Options: GameOptions): GameOptions {
	const options: GameOptions = Math.random() > 0.5 ? player1Options : player2Options;
	console.log(options);
	return options;
}

/** @todo change with real matchmaking */
async function askMatchmakingSystem(username: string): Promise<number> {
	console.log("look for", username);
	const id = MATCHS.get(username);
	if (id !== undefined) {
		MATCHS.delete(username);
		return id;
	}
	if (WAITING_PLAYERS.length >= 2) {
		console.log("New game found", MATCHS);
		const [player1, player2] = WAITING_PLAYERS.splice(0, 2);
		const id = registerGameOptions(getRandomOptions(player1.options, player2.options), GameType.RANKED, [player1.username, player2.username]);
		const enemy = player1.username === username ? player2 : player1;
		MATCHS.set(enemy.username, id);
		return id;
	}
	console.log("No game found", MATCHS);
	return (-1);
}

export { addPlayerToMatchmakingSystem, isUserWaiting, askMatchmakingSystem };
