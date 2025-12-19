import { FastifyRequest, FastifyReply } from "fastify";
import { GameType } from "../game/web_sockets/connection.js";
import { sendReply } from "../utils/HTTP.js";
import { GameOptions } from "../game/settings/GameSettings.js";
import { registerGameOptions } from "../game/game_manager.js";
import { Errors, Success } from "../../shared/status_codes.js";

const WAITING_PLAYERS = new Map<string, GameOptions>(); // username | options
const MATCHS = new Map<string, number>();

function isUserWaiting(user: string) : boolean {
	return WAITING_PLAYERS.has(user) || MATCHS.has(user);
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
	WAITING_PLAYERS.set(user, options);
	setTimeout(() => { // removed player from waiting list if waited more than 1 minutes
		WAITING_PLAYERS.delete(user);
	}, 60 * 1000);
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
	if (WAITING_PLAYERS.size >= 2) {
		console.log("New game found", MATCHS);
		const iterator = WAITING_PLAYERS.entries();
		const first = iterator.next();
		const second = iterator.next();

		if (first.done || second.done) {
			return -1; // safety guard, should not happen
		}

		const [username1, options1] = first.value;
		const [username2, options2] = second.value;

		// Remove them from waiting list
		WAITING_PLAYERS.delete(username1);
		WAITING_PLAYERS.delete(username2);
		const id = registerGameOptions(getRandomOptions(options1, options2), GameType.RANKED, [username1, username2]);
		const enemy = username1 === username ? username2 : username1;
		MATCHS.set(enemy, id);
		return id;
	}
	console.log("No game found", MATCHS);
	return (-1);
}

export { addPlayerToMatchmakingSystem, isUserWaiting, askMatchmakingSystem };
