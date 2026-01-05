import { Elo } from "../elo/elo.js";
import { updateDataAllPlayer, defineEloDistance } from "./update_player_data.js";
import { getMatchingPairTab } from "./pair_managment.js";
import { fillMatchMap } from "./match_managment.js";
import { GameOptions } from "../../game/settings/GameSettings.js";
import { getElo } from "../../database/web3/contract_service.js";
import { getCurrentSeason } from "../../database/season.js";
import { wait } from "../../utils/time.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { sendReply } from "../../utils/HTTP.js";
import { Success, Errors } from "#shared/status_codes.js";
import { GUEST_NAME } from "../../user_management/create_account.js";

interface PlayerData {
	username: string;
	elo: Elo;
	option: GameOptions;
};

/**
 * Player in the queue.
 * @param player - Player Data.
 * @param waitingTime - Time since the player has been in the queue.
 * @param eloDistance - Acceptable elo difference for the player.
 */
interface WaitingPlayer {
	player: PlayerData;
	waitingTime: number;
	eloDistance: number;
};

/**
 * Consecutive pair of players in the queue sorted by ratings.
 * @param first - Waiting player with the lowest ratings.
 * @param second - Waiting player with the highest ratings.
 * @param matchingScore - Matching score (it must be as small as possible).
 */
interface Pair {
	first: WaitingPlayer;
	second: WaitingPlayer;
	matchingScore: number;
};

interface Match {
	usernameP1: string;
	usernameP2: string;
	playerConnected: number;
};

/** List of players who are not yet in the queue. */
const NEW_PLAYER_LIST: PlayerData[] = [];

/** List of players in the queue. */
const WAITING_PLAYER_LIST: WaitingPlayer[] = [];

/** List of match ready to start. */
const MATCH_MAP = new Map<number, Match>();

/** 
 * @todo
 * gérer le cas ou le joueur refresh la page et se réinscris à la file du matchmaking
 * ou s'il refresh et attend sur une autre page.
 */

/**
 * Manage matchmaking.
 * @warning Must be run when the server starts up and must not be awaited.
 */
async function matchmaking(): Promise<void> {
	while (true) {
		transferNewPlayersInQueue();
		updateDataAllPlayer(WAITING_PLAYER_LIST);
		sortWaitingPlayerByRatings();
		const matchingPairTab: Pair[] = getMatchingPairTab(WAITING_PLAYER_LIST);
		fillMatchMap(WAITING_PLAYER_LIST, MATCH_MAP, matchingPairTab);
		await wait(100);/** @todo adapt the 100 */
		//console.log(NEW_PLAYER_LIST);
		//console.log(WAITING_PLAYER_LIST);
		//console.log(MATCH_MAP);
	}
}

function transferNewPlayersInQueue(): void {
	while (NEW_PLAYER_LIST.length !== 0) {
		const playerInQueue: WaitingPlayer = {
			player: NEW_PLAYER_LIST[0],
			waitingTime: 0,
			eloDistance: defineEloDistance(0)
		};
		NEW_PLAYER_LIST.shift();
		WAITING_PLAYER_LIST.push(playerInQueue);
	}
}

function sortWaitingPlayerByRatings(): void {
	WAITING_PLAYER_LIST.sort((playerA, playerB) => playerA.player.elo.r - playerB.player.elo.r);
}

async function addPlayerToMatchmakingSystem(username: string, option: GameOptions): Promise<void> {
	await addNewPlayerInMatchmaking(username, option);
}

function isUserWaiting(username: string) : boolean {
	const findPlayerData = NEW_PLAYER_LIST.find((playerData) => playerData.username === username);
	if (findPlayerData)
		return true;
	const findWaitingPlayer = WAITING_PLAYER_LIST.find((waitingPlayer) => waitingPlayer.player.username === username);
	if (findWaitingPlayer)
		return true;
	let findMatch = false;
	MATCH_MAP.forEach((match) => {
		if (match.usernameP1 === username || match.usernameP2 === username) {
			findMatch = true;
			return;
		}
	});
	return findMatch;
}

async function addNewPlayerInMatchmaking(username: string, option: GameOptions): Promise<void> {
	const currentSeasonId = await getCurrentSeason();
	if (!currentSeasonId)
		throw new Error("Error to get current season");
	const elo = await getElo(username, currentSeasonId);
	if (elo.r === 0) { /** @todo use function of elo (or create new function for that) */
		elo.r = 1500;
		elo.rd = 350;
	}
	const player: PlayerData = {
		username: username,
		elo: elo,
		option: option
	};
	NEW_PLAYER_LIST.push(player);
}

/**
 * Search the game id of the player match.
 * @returns -1 if player is in the queue and game id if player found a match.
 */
function searchPlayerMatch(username: string): number {
	let id = -1;
	let playerConnected = 0;
	MATCH_MAP.forEach((match, key) => {
		if (match.usernameP1 === username || match.usernameP2 === username) {
			id = key;
			++match.playerConnected;
			playerConnected = match.playerConnected;
			return;
		}
	});
	console.log("id", id);
	if (id !== -1 && playerConnected >= 2)
		MATCH_MAP.delete(id);
	return id;
}

/** @todo Old version : must be removed. */
//function addPlayerToMatchmakingSystem(id: string, options: GameOptions): void {
//	if (WAITING_PLAYERS.set(id, options))
//		console.log(`${id} added to waiting list`);
//}

function removePlayerFromMatchmakingSystem(id: string): void {
	//if (WAITING_PLAYERS.delete(id))
	console.log(`${id} removed of waiting list`);
}

/** @todo Old old version : must be removed. */
//async function removePlayerFromMatchmakingSystem(req: FastifyRequest, reply: FastifyReply): Promise<void> {
//	const user = req.user;
//	if (!user)
//		return;

//	let id: string = user;
//	if (user === GUEST_NAME)
//		id = String(req.guestId);
//	if (!id)
//		return;

//	if (!isUserWaiting(id)) {
//		sendReply(reply, Errors.NOT_IN_QUEUE);
//		return;
//	}
//	/** @todo manage old line : WAITING_PLAYERS.delete(id); */
//	sendReply(reply, Success.REMOVED_FROM_QUEUE);
//}

export { WaitingPlayer, Pair, Match };
export { addPlayerToMatchmakingSystem, isUserWaiting, searchPlayerMatch, matchmaking, removePlayerFromMatchmakingSystem };
