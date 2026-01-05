
import { WaitingPlayer } from "./matchmaking.js";

const OFFSET_H = 195;			// Offset height (number).
const OFFSET_W = 400;			// Offset width (number).
const GROWTH_RATE = 0.01;		// Growth rate of the function (number >= 0).
const CARRYING_CAPACITY = 400;	// Maximum of the function, without the offset height and the overgrowth coefficient (integer > 0).
const OVERGROWTH_COEFF = 4;		// Overgrowth coefficient, to rise continually (number >= 0).

const OVERGROWTH_RATE = OVERGROWTH_COEFF / CARRYING_CAPACITY;

let time = Date.now();

/**
 * Update waiting time and elo distance of each players in the queue.
 * @param waitingPlayerList List of players in the queue.
 */
function updateDataAllPlayer(waitingPlayerList: WaitingPlayer[]): void {
	const currentTime = Date.now();
	const elapsedTime = currentTime - time;
	time = currentTime;
	waitingPlayerList.forEach(player => {
		player.waitingTime += elapsedTime;
		player.eloDistance = defineEloDistance(player.waitingTime);
	});
}

function defineEloDistance(t: number): number {
	const denominator = 1 + Math.exp(-GROWTH_RATE * (t - OFFSET_W));
	return (OFFSET_H + OVERGROWTH_RATE * t + CARRYING_CAPACITY / denominator);
}

export { updateDataAllPlayer, defineEloDistance };
