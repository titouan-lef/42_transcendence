import { DEFAULT_RATINGS, Elo, getRatings } from "../elo/elo.js";
import { updateDataAllPlayer, defineEloDistance } from "./update_player_data.js";
import { getMatchingPairTab } from "./pair_managment.js";
import { findMatch } from "./match_managment.js";
import { GameOptions } from "../../game/settings/GameSettings.js";
import { getElo } from "../../database/web3/contract_service.js";
import { getCurrentSeason } from "../../database/season.js";
import { wait } from "../../utils/time.js";
import { WebSocket } from "ws";
import { isValidName } from "../../user_management/create_account.js";

interface PlayerData {
	socket: WebSocket;
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

/** List of players who are not yet in the queue. */
const NEW_PLAYER_LIST: PlayerData[] = [];

/** List of players in the queue. */
const WAITING_PLAYER_LIST: WaitingPlayer[] = [];

/**
 * Manage matchmaking.
 * @warning Must be run when the server starts up and must not be awaited.
 */
async function matchmaking(): Promise<void> {
	while (true) {
		transferNewPlayersInQueue();
		updateDataAllPlayer(WAITING_PLAYER_LIST);
		removeDisconnectedPlayer();
		sortWaitingPlayerByRatings();
		const matchingPairTab: Pair[] = getMatchingPairTab(WAITING_PLAYER_LIST);
		findMatch(WAITING_PLAYER_LIST, matchingPairTab);
		await wait(100);/** @todo adapt the 100 */
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

function removeDisconnectedPlayer(): void {
	for (let i = WAITING_PLAYER_LIST.length - 1; i >= 0; --i) {
		if (WAITING_PLAYER_LIST[i].player.socket.readyState === WebSocket.CLOSED)
			WAITING_PLAYER_LIST.splice(i, 1);
	}
}

function sortWaitingPlayerByRatings(): void {
	WAITING_PLAYER_LIST.sort((playerA, playerB) => playerA.player.elo.r - playerB.player.elo.r);
}

async function addPlayerToMatchmakingSystem(socket: WebSocket, username: string, option: GameOptions): Promise<void> {
	console.log("Player", username, "is in the queue");
	const currentSeasonId = await getCurrentSeason();
	if (!currentSeasonId)
		throw new Error("Error to get current season");
	let elo: Elo;
	if (!isValidName(username))
		elo = { r: DEFAULT_RATINGS, rd: 0 };
	else {
		elo = await getElo(username, currentSeasonId);
		elo.r = getRatings(elo);
	}
	const player: PlayerData = {
		socket: socket,
		username: username,
		elo: elo,
		option: option
	};
	NEW_PLAYER_LIST.push(player);
}

function isUserWaiting(username: string) : boolean {
	const findPlayerData = NEW_PLAYER_LIST.find((playerData) => playerData.username === username);
	if (findPlayerData)
		return true;
	const findWaitingPlayer = WAITING_PLAYER_LIST.find((waitingPlayer) => waitingPlayer.player.username === username);
	return (findWaitingPlayer !== undefined);
}

function removePlayerFromMatchmakingSystem(username: string): void {
	for (let i = NEW_PLAYER_LIST.length - 1; i >= 0; --i) {
		if (NEW_PLAYER_LIST[i].username === username)
			NEW_PLAYER_LIST.splice(i, 1);
	}
}

export { WaitingPlayer, Pair };
export { addPlayerToMatchmakingSystem, isUserWaiting, matchmaking, removePlayerFromMatchmakingSystem };
