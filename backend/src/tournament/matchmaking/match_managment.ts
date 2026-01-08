import { GameType, registerGameOptions } from "../../game/game_manager.js";
import { getPlage, lerp } from "../../utils/math.js";
import { WaitingPlayer, Pair } from "./matchmaking.js";
import { GameOptions } from "../../game/settings/GameSettings.js";
import { WebSocket } from "ws";

const RATE_ELO_DIST_MAX = 0.5;

function findMatch(waitingPlayerList: WaitingPlayer[], matchingPairTab: Pair[]): void {
	for (let i = 0; i < matchingPairTab.length; i++) {
		if (isValidMatch(matchingPairTab[i]))
			createMatch(waitingPlayerList, i, matchingPairTab);
	}
}

function isValidMatch(match: Pair): boolean {
	const realEloDist = match.second.player.elo.r - match.first.player.elo.r;
	const plage = getPlage(match.first.eloDistance, match.second.eloDistance);
	const eloDistMax = lerp(plage.min, plage.max, RATE_ELO_DIST_MAX);
	return (realEloDist <= eloDistMax);
}

function createMatch(waitingPlayerList: WaitingPlayer[], index: number, matchingPairTab: Pair[]): void {
	const p1 = matchingPairTab[index].first.player;
	const p2 = matchingPairTab[index].second.player;
	const usernameP1 = p1.username;
	const usernameP2 = p2.username;
	removePairObsolete(matchingPairTab, index, usernameP1, usernameP2);

	const socketP1IsClosed = (p1.socket.readyState === WebSocket.CLOSED);
	const socketP2IsClosed = (p2.socket.readyState === WebSocket.CLOSED);
	if (playerDisconnection(waitingPlayerList, usernameP1, socketP1IsClosed, socketP2IsClosed))
		return;
	if (playerDisconnection(waitingPlayerList, usernameP2, socketP2IsClosed, socketP1IsClosed))
		return;
	removeTwoPlayersInQueue(waitingPlayerList, usernameP1, usernameP2);
	const option = getRandomOptions(p1.option, p2.option);
	const id = registerGameOptions(option, GameType.RANKED, [usernameP1, usernameP2], [p1.elo, p2.elo]);
	manageSocketValidation(p1.socket, id);
	manageSocketValidation(p2.socket, id);
}

/**
 * Remove all Pairs which contain at least one player in the current match.
 * @param matchingPairTab Array of consecutive pair of players in the queue and sort them by score.
 * @param index Index of Pair array in the current match.
 * @param usernameP1 Username of player 1 in the current match.
 * @param usernameP2 Username of player 2 in the current match.
 */
function removePairObsolete(matchingPairTab: Pair[], index: number, usernameP1: string, usernameP2: string): void {
	for (let i = matchingPairTab.length - 1; i > index; --i) { // matchingPairTab[index] is not managed because it is not use after.
		const playerFirstName = matchingPairTab[i].first.player.username;
		const playerSecondName = matchingPairTab[i].second.player.username;
		if (usernameP1 === playerFirstName || usernameP1 === playerSecondName || usernameP2 === playerFirstName || usernameP2 === playerSecondName)
			matchingPairTab.splice(i, 1);
	}
}

function playerDisconnection(waitingPlayerList: WaitingPlayer[], username: string, socketPlayerIsClosed: boolean, socketOpponentIsClosed: boolean): boolean {
	if (!socketPlayerIsClosed)
		return false;
	if (!socketOpponentIsClosed)
		removeOnePlayerInQueue(waitingPlayerList, username);
	return true;
}

function removeOnePlayerInQueue(waitingPlayerList: WaitingPlayer[], username: string): void {
	for (let i = waitingPlayerList.length - 1; i >= 0; --i) {
		if (waitingPlayerList[i].player.username === username) {
			waitingPlayerList.splice(i, 1);
			return;
		}
	}
}

function removeTwoPlayersInQueue(waitingPlayerList: WaitingPlayer[], usernameP1: string, usernameP2: string): void {
	for (let i = waitingPlayerList.length - 1, nbFind = 0; i >= 0 && nbFind < 2; --i) {
		const currentUsername = waitingPlayerList[i].player.username;
		if (currentUsername !== usernameP1 && currentUsername !== usernameP2)
			continue;
		waitingPlayerList.splice(i, 1);
		++nbFind;
	}
}

function getRandomOptions(optionP1: GameOptions, optionP2: GameOptions): GameOptions {
	return (Math.random() > 0.5 ? optionP1 : optionP2);
}

function manageSocketValidation(socket: WebSocket, gameId: number): void {
	socket.send(JSON.stringify({ id: gameId }));
	socket.close(1000, "Game found");
}

export { findMatch };
