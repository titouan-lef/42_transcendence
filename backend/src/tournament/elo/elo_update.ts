import { isValidName } from "../../user_management/create_account.js";
import { insertEloVariation } from "../../database/elo.js";
import { getDateLastGame, getPlayerGameCountBySeason } from "../../database/game.js";
import { getPlacementGames, insertPlacementGame, Placement } from "../../database/placement.js";
import { getCurrentSeason } from "../../database/season.js";
import { getElo, setElo, setRatingDeviation } from "../../database/web3/contract_service.js";
import { nbDayBetween } from "../../utils/time.js";
import { MAX_RD, Elo, applyTimeOnRd, eloIsDefine, updateEloAfterGame, updateEloAfterGamePlacement, MULT_FACTOR } from "./elo.js";
import { NB_PLACEMENT_GAME } from "#shared/constant.js";

interface EloData {
	username: string;
	nbGame: number;
	oldElo: Elo;
	elo: Elo;
	outcome: number;
};

async function updateElo(usernameP1: string, eloP1: Elo, usernameP2: string, eloP2: Elo, outcome: number, gameId: number): Promise<void> {
	if (!isValidName(usernameP1) && !isValidName(usernameP2))
		return;

	const currentSeasonId = await getCurrentSeason();
	if (!currentSeasonId)
		throw new Error("Error to get current season");

	const ratingsP1 = (await getElo(usernameP1, currentSeasonId)).r;
	if (ratingsP1 > 0)
		eloP1.r = ratingsP1;
	const ratingsP2 = (await getElo(usernameP2, currentSeasonId)).r;
	if (ratingsP2 > 0)
		eloP2.r = ratingsP2;

	const eloDataP1 = await createEloData(usernameP1, eloP1, currentSeasonId, outcome);
	if (!eloDataP1)
		throw new Error("Error to create elo data of player 1");
	const eloDataP2 = await createEloData(usernameP2, eloP2, currentSeasonId, 1 - outcome);
	if (!eloDataP2)
		throw new Error("Error to create elo data of player 2");

	if (isValidName(eloDataP1.username))
		await addPlacementGame(eloDataP1, eloDataP2.elo, gameId);
	if (isValidName(eloDataP2.username))
		await addPlacementGame(eloDataP2, eloDataP1.elo, gameId);

	await saveElo(eloDataP1, eloDataP2.oldElo, gameId, currentSeasonId);
	await saveElo(eloDataP2, eloDataP1.oldElo, gameId, currentSeasonId);
}

async function createEloData(username: string, eloBeforeInactivity: Elo, seasonId: number, outcome: number): Promise<EloData | null> {
	if (!isValidName(username)) {
		eloBeforeInactivity.rd = MAX_RD;
		return fillEloData(username, 1, eloBeforeInactivity, outcome);
	}
	const nbGameInDb = await getPlayerGameCountBySeason(username, seasonId);
	if (nbGameInDb === undefined)
		return null;
	const nbGame = nbGameInDb + 1;// Games in database + current game.
	const elo = await getEloAfterInactivity(username, nbGame, eloBeforeInactivity, seasonId);
	if (!elo)
		return null;
	return fillEloData(username, nbGame, elo, outcome);
}

function fillEloData(username: string, nbGame: number, elo: Elo, outcome: number): EloData {
	return {
		username: username,
		nbGame: nbGame,
		oldElo: elo,
		elo: structuredClone(elo),// Clone to update elo without update oldElo.
		outcome: outcome
	};
}

async function getEloAfterInactivity(username: string, nbGame: number, elo: Elo, seasonId: number): Promise<Elo | null> {
	if (eloIsDefine(elo))
		return await updateRdPlayer(username, nbGame, elo, seasonId);
	elo.rd = MAX_RD;
	return elo;
}

async function updateRdPlayer(username: string, nbGame: number, elo: Elo, seasonId: number): Promise<Elo | null> {
	if (nbGame === 1) // If the current game is the first game of the season.
		elo.rd = applyTimeOnRd(elo.rd);
	else {
		const strDateLastGame = await getDateLastGame(username);
		if (!strDateLastGame)
			return null;
		const dateLastGame = new Date(strDateLastGame);
		const t = nbDayBetween(new Date(), dateLastGame);// Time elapsed since the last game (in day).
		elo.rd = applyTimeOnRd(elo.rd, t);
	}
	if (nbGame < NB_PLACEMENT_GAME) // If (nbGame >= NB_PLACEMENT_GAME), rd is update with ratings.
		setRatingDeviation(username, seasonId, elo.rd); /** @warning Not await for perf */
	return elo;
}

async function addPlacementGame(eloData: EloData, eloOpp: Elo, gameId: number): Promise<void> {
	if (eloData.nbGame > NB_PLACEMENT_GAME)
		return;
	const placementGame: Placement = (Math.abs(eloData.elo.r - eloOpp.r) >= MULT_FACTOR) ?
		{ rOpp: eloData.elo.r, rdOpp: eloData.elo.rd, outcome: 0.5 } : // If match is unequaled, no update.
		{ rOpp: eloOpp.r, rdOpp: eloOpp.rd, outcome: eloData.outcome };
	await insertPlacementGame(eloData.username, gameId, placementGame);
}

async function saveElo(eloData: EloData, eloOpp: Elo, gameId: number, seasonId: number): Promise<void> {
	if (eloData.nbGame < NB_PLACEMENT_GAME || !isValidName(eloData.username)) {
		await insertEloVariation(eloData.username, gameId, 0);
		return;
	}
	await manageUpdateElo(eloData, eloOpp, seasonId);
	setElo(eloData.username, seasonId, eloData.elo); /** @warning Not await for perf */
	await insertEloVariation(eloData.username, gameId, eloData.elo.r - eloData.oldElo.r);
}

async function manageUpdateElo(eloData: EloData, eloOpp: Elo, seasonId: number): Promise<void> {
	if (eloData.nbGame === NB_PLACEMENT_GAME)
		await defineEloWithPlacementGames(eloData, seasonId);
	else
		updateEloAfterGame(eloData.elo, eloOpp, eloData.outcome);
}

async function defineEloWithPlacementGames(eloData: EloData, seasonId: number): Promise<void> {
	const tabPlacement = await getPlacementGames(eloData.username, seasonId);
	if (tabPlacement.length !== NB_PLACEMENT_GAME)
		throw new Error("Invalid number of placement games");
	const tabEloOpp = getTabElo(tabPlacement);
	const tabOutcome = getTabOutcome(tabPlacement);
	updateEloAfterGamePlacement(eloData.elo, tabEloOpp, tabOutcome);
}

/**
 * @warning Length not tested.
 */
function getTabElo(tabPlacement: Placement[]): Elo[] {
	const tabElo: Elo[] = [];
	tabPlacement.forEach(placement => tabElo.push({ r: placement.rOpp, rd: placement.rdOpp }));
	return tabElo;
}

/**
 * @warning Length not tested.
 */
function getTabOutcome(tabPlacement: Placement[]): number[] {
	const tabOutcome: number[] = [];
	tabPlacement.forEach(placement => tabOutcome.push(placement.outcome));
	return tabOutcome;
}

export { updateElo };
