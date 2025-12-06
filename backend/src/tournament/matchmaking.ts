import { FastifyRequest, FastifyReply } from "fastify";
import { GameType } from "../game/web_sockets/connection.js";
import { sendReply } from "../utils/HTTP.js";
import { randomBoolean } from "../game/utils.js";
import { GameOptions } from "../game/settings/GameSettings.js";
import { registerGameOptions } from "../game/game_manager.js";

const WAITING_PLAYERS: string[] = [];
const MATCHS = new Map<string, number>();

function isUserWaiting(user: string) : boolean {
	return WAITING_PLAYERS.includes(user) || MATCHS.has(user);
}

async function addPlayerToMatchmakingSystem(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	if (isUserWaiting(user)) {
		sendReply(reply, 400, "Already looking for a game"); /**@todo use translate tool */
		return;
	}
	WAITING_PLAYERS.push(user);
	sendReply(reply, 200, "Looking for a game"); /**@todo use translate tool */
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
		const id = registerGameOptions(getRandomOptions(), GameType.RANKED, [player1, player2]);
		const enemy = player1 === username ? player2 : player1;
		MATCHS.set(enemy, id);
		return id;
	}
	console.log("No game found", MATCHS);
	return (-1);
}

export { addPlayerToMatchmakingSystem, isUserWaiting, askMatchmakingSystem };
