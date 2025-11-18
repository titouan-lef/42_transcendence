/**
 * @file elo.ts
 * 
 * Method to calculate Elo : The Glicko system (Glicko-1).
 * Variable names : Use those in the documentation.
 * Abbreviation : sq for squared value.
 */

import { clamp } from "../utils/math.js";

/**
 * @param r - Ratings (public value of the Elo).
 * @param rd - Ratings Deviation (secret value of the Elo).
 */
interface Elo {
	r: number;
	rd: number;
};

interface DataResult {
	deviation: number;
	accuracy: number;
}

// Elo data limits.
const MIN_RATINGS = 1;
const MAX_RATINGS = 1000000;
const MIN_RD = 30;
const MAX_RD = 350;

// Season data.
const SEASON_DURATION = 2; // Time in day.
const NB_SEASON_TO_RESET = 30;
const RD_REF = 50;
const NB_PLACEMENT_GAME = 3;

// Constant to increase in uncertainty between rating periods.
const C = Math.sqrt((MAX_RD * MAX_RD - RD_REF * RD_REF) / NB_SEASON_TO_RESET);
const C_SQ = C * C;

// Calculation constant.
const MULT_FACTOR = 400; // Multiplicative factor constant convention.
const Q = Math.LN10 / MULT_FACTOR; // Scaling constant convention.
const Q_SQ = Q * Q;
const PI_SQ = Math.PI * Math.PI;

/**
 * Update the elo of the player after a game that is not a placement game.
 * @param elo Elo of the player.
 * @param eloOpp Elo of the opponent.
 * @param outcome outcome of the match (defined on [0, 1]).
 * @param t Time elapsed since the last game (in day).
 */
function updateEloAfterGame(elo: Elo, eloOpp: Elo, outcome: number, t: number): void {
	elo.rd = applyTimeOnRd(elo.rd, t);
	const rdDistance = Math.sqrt(elo.rd * elo.rd + eloOpp.rd * eloOpp.rd);
	const resultData = getResultData(elo.r, eloOpp.r, rdDistance, outcome);
	updateElo(elo, resultData.accuracy, resultData.deviation);
}

/**
 * Update the player's Elo after completing all placement games.
 * @param elo Elo of the player.
 * @param tabEloOpp Array of elo of opponents.
 * @param tabOutcome Array of outcomes of placement games (an outcome is defined on [0, 1]).
 */
function updateEloNewSeason(elo: Elo, tabEloOpp: Elo[], tabOutcome: number[]): void {
	elo.rd = applyTimeOnRd(elo.rd, SEASON_DURATION);
	updateEloGamePlacement(elo, tabEloOpp, tabOutcome);
}

function applyTimeOnRd(rd: number, t: number): number {
	const rdUpdated = Math.sqrt(rd * rd + C_SQ * t);
	return Math.min(rdUpdated, MAX_RD);
}

/**
 * Create the player's Elo after completing all placement games.
 * The player must not already have an Elo.
 * @param tabEloOpp Array of elo of opponents.
 * @param tabOutcome Array of outcomes (an outcome is defined on [0, 1]).
 */
function defineEloNewPlayer(tabEloOpp: Elo[], tabOutcome: number[]): Elo {
	const elo: Elo = { r: 1500, rd: MAX_RD };
	updateEloGamePlacement(elo, tabEloOpp, tabOutcome);
	return elo;
}

function updateEloGamePlacement(elo: Elo, tabEloOpp: Elo[], tabOutcome: number[]): void {
	const sumResultData: DataResult = { deviation: 0, accuracy: 0 };
	for (let j = 1; j <= NB_PLACEMENT_GAME; ++j) {
		const eloOpp = tabEloOpp[j-1];
		const resultData = getResultData(elo.r, eloOpp.r, eloOpp.rd, tabOutcome[j-1]); // For no classed player, elo distance is opponent's rd.
		sumResultData.deviation += resultData.deviation;
		sumResultData.accuracy += resultData.accuracy;
	}
	updateElo(elo, sumResultData.accuracy, sumResultData.deviation);
}

function getResultData(r: number, rOpponent: number, rdDistance: number, outcome: number): DataResult {
	const weight = g(rdDistance);
	const e = expectedOutcome(r, rOpponent, weight);
	const resultData: DataResult = {
		deviation: deviation(weight, outcome, e),
		accuracy: accuracy(weight, e)
	};
	return resultData;
}

/**
 * Ratings Deviation weighted for one game.
 * @param rd Ratings Deviation of the opponent.
 */
function g(rd: number): number {
	const denominator = Math.sqrt(1 + 3 * Q_SQ * (rd * rd) / PI_SQ);
	return (1 / denominator);
}

/**
 * Probability to win the game (E in the documentation).
 */
function expectedOutcome(r: number, ratingsOpponent : number, weight: number): number {
	const exponent = - weight * (r - ratingsOpponent ) / MULT_FACTOR;
	const denominator = 1 + Math.pow(10, exponent);
	return (1 / denominator);
}

/**
 * Difference weighted between expectation and real result of the game.
 * If result is negative, player has underperformed.
 * If result is positive, player has overperformed.
 */
function deviation(weight: number, outcome: number, e: number): number {
	return weight * (outcome - e);
}

/**
 * Accuracy of the game result.
 * High accuracy allows for significant variation in the ratings while remaining accurate.
 */
function accuracy(weight: number, e: number): number {
	return (weight * weight * e * (1 - e));
}

function updateElo(elo: Elo, accuracyTotal: number, deviationTotal: number): void {
	const newRdSq = rdSquared(elo.rd, accuracyTotal);
	elo.r = rCalculation(elo.r, deviationTotal, newRdSq);
	elo.rd = rdCalculation(newRdSq);
}

function rdSquared(rd: number, sumAccuracy: number): number {
	const dSq = deviationRateSquared(sumAccuracy);
	const denominator = 1 / (rd * rd) + 1 / dSq;
	return (1 / denominator);
}

/**
 * Measures the uncertainty of the expected variance for all games (d^2 in the documentation).
 * More the result is high, more the incertitude is high.
 */
function deviationRateSquared(sumAccuracy: number): number {
	const denominator = Q_SQ * sumAccuracy;
	return (1 / denominator);
}

function rCalculation(r: number, sumDeviation: number, newRdSq: number): number {
	const deviation = Math.round(Q * newRdSq * sumDeviation);
	const newR = r + deviation;
	return clamp(newR, MIN_RATINGS, MAX_RATINGS);
}

function rdCalculation(newRdSq: number): number {
	const newRd = Math.sqrt(newRdSq);
	return clamp(newRd, MIN_RD, MAX_RD);
}

export { updateEloAfterGame, updateEloNewSeason, defineEloNewPlayer };
