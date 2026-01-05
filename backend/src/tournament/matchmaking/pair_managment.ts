import { getPlage, lerp } from "../../utils/math.js";
import { WaitingPlayer, Pair } from "./matchmaking.js";

const COEFF_RATINGS = 1;			// Coefficient which weight the score according to ratings.
const COEFF_TIME = 0.5;				// Coefficient which weight the score according to time.
const TIME_MAX_DISTRIBUTION = 0.5;	// Distribution of the waiting time of the 2 players (on [0, 1]).

/**
 * Get all consecutive pair of players in the queue and sort them by score.
 * @param waitingPlayerList List of players in the queue, sorted by ratings.
 * @returns An array of Pair.
 */
function getMatchingPairTab(waitingPlayerList: WaitingPlayer[]): Pair[] {
	const matchingPairTab: Pair[] = [];
	for (let i = 1; i < waitingPlayerList.length; ++i) {
		const pair = makePair(waitingPlayerList[i-1], waitingPlayerList[i]);
		matchingPairTab.push(pair);
	}
	sortMatchingPairByScore(matchingPairTab);
	return matchingPairTab;
}

function makePair(wp1: WaitingPlayer, wp2: WaitingPlayer): Pair {
	const matchingScore = getMatchingScore(wp1, wp2);
	return { first: wp1, second: wp2, matchingScore: matchingScore };
}

function getMatchingScore(wp1: WaitingPlayer, wp2: WaitingPlayer): number {
	const ratingsScore = (wp2.player.elo.r - wp1.player.elo.r);
	const timeScore = getTimeScore(wp1.waitingTime, wp2.waitingTime);
	return (COEFF_RATINGS * ratingsScore - COEFF_TIME * timeScore);
}

function getTimeScore(p1WaitingTime: number, p2WaitingTime: number): number {
	const plage = getPlage(p1WaitingTime, p2WaitingTime);
	return lerp(plage.min, plage.max, TIME_MAX_DISTRIBUTION);
}

function sortMatchingPairByScore(matchingPairTab: Pair[]): void {
	matchingPairTab.sort((pairA, pairB) => pairA.matchingScore - pairB.matchingScore);
}

export { getMatchingPairTab };
