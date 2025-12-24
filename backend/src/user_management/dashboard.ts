import { FastifyRequest, FastifyReply, sendReply } from "fastify";
import { getGamesLoosesBySeason, getGamesPlayedCount, getGamesWinsBySeason, getWinrateBySeasonAndDate } from "../database/fetchGame";
import { BallOption, MapOption } from "#shared/types_transfert.js";
import { getEloVariatonBySeason, getGameTimeAverageBySeason, getGoalAverageBySeason, getPreferedBallBySeason, getPreferedMapBySeason } from "src/database/fetchStats";
import { getElo } from "src/database/web3/contract_service";
import { Elo } from '../../tournament/elo/elo.js';
import { getAllSeasonId } from "src/database/season";
import { DEFAULT_RATINGS } from "src/tournament/elo/elo";

// tableau de date envoyer qui permet de remplir le chart
interface eloChart {
	dateList: string[];
	eloList: number[];
}

// tableau de date envoyer qui permet de remplir le chart
interface winrateChart {
	dateList: string[];
	winrateList: number[];
}

// tableau de date envoyer qui permet de remplir le chart
interface goalChart {
	dateList: string[];
	goalList: number[];
}

interface userInfos {
	gamesPlayed: number;
	gamesWins: number; // depuis le debut de la saison ?
	gamesLooses: number; 
	elo: number;
	goalAverage: number;
	durationAverage: number;//(in seconds)
	preferedBall: BallOption;
	preferedMap: MapOption;
	eloChart: eloChart;
	winrateChart: winrateChart;
	goalChart: goalChart;
}

interface UserInfoBody {
	user: string;
	season: string;
	dates: Date[];
}


async function getEloChart(season: number, user: string):Promise <eloChart> {

	const eloVariaton = await getEloVariatonBySeason(season, user);
	if (eloVariaton?.length === 0)
		return {dateList: [], eloList: []};

	const idSeasonTab: number[] = await getAllSeasonId();
	if (idSeasonTab.length === 0)
		return {dateList: [], eloList: []};

	let lastSeasonElo = -1
	for (let i = 1; i < idSeasonTab.length; i++) {
		const tmpElo: number = await getRatingElo(user, idSeasonTab[i]);
		if (tmpElo !== 0)
		{
			lastSeasonElo = tmpElo;
			break;
		}
	}
	if (lastSeasonElo === -1)
		lastSeasonElo = DEFAULT_RATINGS;

	const eloChart: eloChart = {dateList: [], eloList: []};
	for (const eloHistory of eloVariaton)
	{
		lastSeasonElo += eloHistory.variation;
		eloChart.dateList.push(eloHistory.date);
		eloChart.eloList.push(lastSeasonElo);
	}

	return eloChart;
}

async function getGoalChart(season: number, user: string):Promise <goalChart> {
	return ;
}

async function getRatingElo(user: string, season: number): Promise<number> {
	const elo: Elo = await getElo(user, season);
	return elo.r;
}

async function getUserInfos(user: string, season: number): Promise<userInfos> {
	const userInfos: userInfos = {
		gamesPlayed: await getGamesPlayedCount(season, user),
		gamesWins: await getGamesWinsBySeason(season, user),
		gamesLooses: await getGamesLoosesBySeason(season, user),
		elo: await getRatingElo(user, season),
		goalAverage: await getGoalAverageBySeason(season, user),
		durationAverage: await getGameTimeAverageBySeason(season, user) ,
		preferedBall: await getPreferedBallBySeason(season, user),
		preferedMap: await getPreferedMapBySeason(season, user),
		eloChart: await getEloChart(season, user),
		winrateChart: await getWinrateBySeasonAndDate(season, user),
		goalChart: await getGoalChart(season, user)
	};
	return userInfos;
}


async function getPlayerStats(req: FastifyRequest<{ Body: UserInfoBody }>, reply: FastifyReply): Promise<void> {
	const user = req.user;
	if (!user)
		return;
	const season = req.body?.season;
	if (!season) {
		sendReply(reply, 400, "Season doesn't exist");
		return;
	}
	const dates = req.dates;
	const userInfos: userInfos = await getUserInfos(user, season);
	sendReply(reply, 200, JSON.stringify(userInfos));
}

export { winrateChart }
