import { insertEloVariation } from "../../database/elo.js";
import { getDateLastGame, getPlayerNumberGameInCurrentSeason } from "../../database/game.js";
import { getPlacementGames, insertPlacementGame, Placement } from "../../database/placement.js";
import { getCurrentSeason } from "../../database/season.js";
import { eloIsDefine, getElo, setElo, setRatingDeviation } from "../../database/web3/contract_service.js";
import { nbDayBetween } from "../../utils/time.js";
import { applyTimeOnRd, DEFAULT_RATINGS, Elo, MAX_RD, NB_PLACEMENT_GAME, updateEloAfterGame, updateEloAfterGamePlacement } from "./elo.js";

interface EloData {
	username: string;
	nbGame: number;
	oldElo: Elo;
	elo: Elo;
	outcome: number;
};

async function updateElo(usernameP1: string, usernameP2: string, outcome: number, gameId: number): Promise<void> {
	const currentSeasonId = await getCurrentSeason();
	if (!currentSeasonId)
		return;

	const eloDataP1 = await createEloData(usernameP1, currentSeasonId, outcome);
	if (!eloDataP1)
		return;
	const eloDataP2 = await createEloData(usernameP2, currentSeasonId, 1 - outcome);
	if (!eloDataP2)
		return;

	await addPlacementGame(eloDataP1, eloDataP2.elo, gameId);
	await addPlacementGame(eloDataP2, eloDataP1.elo, gameId);

	await saveElo(eloDataP1, eloDataP2.oldElo, gameId, currentSeasonId);
	await saveElo(eloDataP2, eloDataP1.oldElo, gameId, currentSeasonId);
}

async function createEloData(username: string, seasonId: number, outcome: number): Promise<EloData | null> {
	const nbGame = await getPlayerNumberGameInCurrentSeason(username);
	if (nbGame === undefined)
		return null;
	const eloBeforeInactivity = await getElo(username, seasonId);
	const elo = await getEloAfterInactivity(username, nbGame, eloBeforeInactivity, seasonId);
	if (!elo)
		return null;
	return {
		username: username,
		nbGame: nbGame,
		oldElo: elo,
		elo: elo,
		outcome: outcome
	};
}

async function getEloAfterInactivity(username: string, nbPlacementGame: number, elo: Elo, seasonId: number): Promise<Elo | null> {
	if (eloIsDefine(elo))
		return await updateRdPlayer(username, nbPlacementGame, elo, seasonId);
	elo.r = DEFAULT_RATINGS;
	elo.rd = MAX_RD;
	return elo;
}

async function updateRdPlayer(username: string, nbPlacementGame: number, elo: Elo, seasonId: number): Promise<Elo | null> {
	if (nbPlacementGame === 0)
		elo.rd = applyTimeOnRd(elo.rd);
	else {
		const strDateLastGame = await getDateLastGame(username);
		if (!strDateLastGame)
			return null;
		const dateLastGame = new Date(strDateLastGame);
		const t = nbDayBetween(new Date(), dateLastGame);// Time elapsed since the last game (in day).
		elo.rd = applyTimeOnRd(elo.rd, t);
	}
	await setRatingDeviation(username, seasonId, elo.rd);
	return elo;
}

async function addPlacementGame(eloData: EloData, eloOpp: Elo, gameId: number): Promise<void> {
	if (eloData.nbGame >= NB_PLACEMENT_GAME)
		return;
	const placementGame: Placement = { rOpp: eloOpp.r, rdOpp: eloOpp.rd, outcome: eloData.outcome };
	await insertPlacementGame(eloData.username, gameId, placementGame);
}

async function saveElo(eloData: EloData, eloOpp: Elo, gameId: number, seasonId: number): Promise<void> {
	if (eloData.nbGame + 1 < NB_PLACEMENT_GAME) // nb game + this new game < nb placement game.
		return;
	await manageUpdateElo(eloData, eloOpp, seasonId);
	await setElo(eloData.username, seasonId, eloData.elo);
	await insertEloVariation(eloData.username, gameId, eloData.elo.r - eloData.oldElo.r);
}

async function manageUpdateElo(eloData: EloData, eloOpp: Elo, seasonId: number): Promise<void> {
	if (eloData.nbGame + 1 === NB_PLACEMENT_GAME) {
		const tabPlacement = await getPlacementGames(eloData.username, seasonId);
		if (tabPlacement.length !== NB_PLACEMENT_GAME)
			return;
		const tabEloOpp = getTabElo(tabPlacement);
		const tabOutcome = getTabOutcome(tabPlacement);
		updateEloAfterGamePlacement(eloData.elo, tabEloOpp, tabOutcome);
	} else
		updateEloAfterGame(eloData.elo, eloOpp, eloData.outcome);
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
	const tabElo: number[] = [];
	tabPlacement.forEach(placement => tabElo.push(placement.outcome));
	return tabElo;
}

export { updateElo };
