import { GameType, registerGameOptions } from "../../game/game_manager.js";
import { getPlage, lerp } from "../../utils/math.js";
import { WaitingPlayer, Pair, Match } from "./matchmaking.js";
import { GameOptions } from "../../game/settings/GameSettings.js";

const RATE_ELO_DIST_MAX = 0.5;

function fillMatchMap(waitingPlayerList: WaitingPlayer[], matchList: Map<number, Match>, matchingPairTab: Pair[]): void {
	for (let i = 0; i < matchingPairTab.length; i++) {
		if (isValidMatch(matchingPairTab[i]))
			addMatch(waitingPlayerList, i, matchList, matchingPairTab);
	}
}

function isValidMatch(match: Pair): boolean {
	const realEloDist = match.second.player.elo.r - match.first.player.elo.r;
	const plage = getPlage(match.first.eloDistance, match.second.eloDistance);
	const eloDistMax = lerp(plage.min, plage.max, RATE_ELO_DIST_MAX);
	return (realEloDist <= eloDistMax);
}

function addMatch(waitingPlayerList: WaitingPlayer[], index: number, matchList: Map<number, Match>, matchingPairTab: Pair[]): void {
	const p1 = matchingPairTab[index].first.player;
	const p2 = matchingPairTab[index].second.player;
	const usernameP1 = p1.username;
	const usernameP2 = p2.username;

	const option = getRandomOptions(p1.option, p2.option);
	defineMatchInMap(matchList, usernameP1, usernameP2, option);
	removePairObsolete(matchingPairTab, index, usernameP1, usernameP2);
	removePlayerInQueue(waitingPlayerList, usernameP1, usernameP2);
}

function getRandomOptions(optionP1: GameOptions, optionP2: GameOptions): GameOptions {
	return (Math.random() > 0.5 ? optionP1 : optionP2);
}

function defineMatchInMap(matchList: Map<number, Match>, usernameP1: string, usernameP2: string, option: GameOptions): void {
	const id = registerGameOptions(option, GameType.RANKED, [usernameP1, usernameP2]);
	const match: Match = { usernameP1: usernameP1, usernameP2: usernameP2, playerConnected: 0 };
	matchList.set(id, match);
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

function removePlayerInQueue(waitingPlayerList: WaitingPlayer[], usernameP1: string, usernameP2: string): void {
	for (let i = waitingPlayerList.length - 1, nbFind = 0; i >= 0 && nbFind < 2; --i) {
		const currentUsername = waitingPlayerList[i].player.username;
		if (currentUsername !== usernameP1 && currentUsername !== usernameP2)
			continue;
		waitingPlayerList.splice(i, 1);
		++nbFind;
	}
}

export { fillMatchMap };
