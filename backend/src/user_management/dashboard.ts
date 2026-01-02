import { FastifyRequest, FastifyReply } from "fastify";
import { Errors, Success } from "#shared/status_codes.js";
import { UserDashboardInfos } from "#shared/HTTP.js";
import { EloChart, GoalChart, WinrateChart } from "#shared/types_dashboard.js";
import { getGamesLoosesBySeason, getGamesLoosesGlobal, getGamesPlayedCountBySeason, getGamesPlayedCountGlobal, getGamesWinsBySeason, getGamesWinsGlobal } from "../database/fetchGame.js";
import { sendReply } from "../utils/HTTP.js";
import { getEloVariatonBySeason, getEloVariatonGlobal, getGameTimeAverageBySeason, getGameTimeAverageGlobal, getGoalAverageBySeason, getGoalAverageBySeasonAndDate, getGoalAverageGlobal, getGoalAverageGlobalAndDate, getPreferedBallBySeason, getPreferedBallGlobal, getPreferedMapBySeason, getPreferedMapGlobal, getWinrateBySeasonAndDate, getWinrateGlobalAndDate } from "../database/fetchStats.js";
import { getElo } from "../database/web3/contract_service.js";
import { Elo } from '../tournament/elo/elo.js';
import { getAllSeasonId, getCurrentSeason, getEndSeason, getFirstSeason, getSeasonStartedAtById } from "../database/season.js";
import { DEFAULT_RATINGS } from "../tournament/elo/elo.js";
import { getActualDate } from "../database/db_utils.js";

interface UserDashboardInfoBody {
	user: string;
	season: number;
}

const NB_CHART_POINT = 7;

async function getEloChartBySeason(season: number, user: string):Promise <EloChart> {

	const eloVariaton = await getEloVariatonBySeason(season, user);
	if (eloVariaton.length === 0)
		return { dateList: [], eloList: [] };

	const idSeasonTab: number[] = await getAllSeasonId();
	if (idSeasonTab.length === 0)
		return { dateList: [], eloList: [] };

	let lastSeasonElo = DEFAULT_RATINGS;
	for (let i = 1; i < idSeasonTab.length; i++) {
		const tmpElo: number = await getRatingEloBySeason(user, idSeasonTab[i]);
		if (tmpElo !== 0) {
			lastSeasonElo = tmpElo;
			break;
		}
	}

	const eloChart: EloChart = { dateList: [], eloList: [] };
	for (const eloHistory of eloVariaton) {
		lastSeasonElo += eloHistory.variation;
		eloChart.dateList.push(eloHistory.date);
		eloChart.eloList.push(lastSeasonElo);
	}

	return eloChart;
}

async function getEloChartGlobal(user: string):Promise <EloChart> {

	const eloVariaton = await getEloVariatonGlobal(user);
	if (eloVariaton.length === 0)
		return { dateList: [], eloList: [] };

	const idSeasonTab: number[] = await getAllSeasonId();
	if (idSeasonTab.length === 0)
		return { dateList: [], eloList: [] };

	let lastSeasonElo = DEFAULT_RATINGS;
	for (let i = 1; i < idSeasonTab.length; i++) {
		const tmpElo: number = await getRatingEloBySeason(user, idSeasonTab[i]);
		if (tmpElo !== 0) {
			lastSeasonElo = tmpElo;
			break;
		}
	}

	const eloChart: EloChart = { dateList: [], eloList: [] };
	for (const eloHistory of eloVariaton) {
		lastSeasonElo += eloHistory.variation;
		eloChart.dateList.push(eloHistory.date);
		eloChart.eloList.push(lastSeasonElo);
	}

	return eloChart;
}

async function getTabDateBySeason(season: number): Promise <string[]> {

	const beginDate: Date = await getSeasonStartedAtById(season);

	let endDate: Date;
	if (season !== await getCurrentSeason()) {
		endDate = await getEndSeason(season);
	} else
		endDate = await getActualDate();

	const beginDateInMs:number = beginDate.getTime();
	const endDateInMs:number = endDate.getTime();

	const intervaleDateInMs: number = (endDateInMs - beginDateInMs) / (NB_CHART_POINT - 1);

	const dates: string[] = [];

	for (let i = 0; i < NB_CHART_POINT; i++) {
		const pointDate = new Date(beginDateInMs + (intervaleDateInMs * i));
		dates.push(pointDate.toString());
	}

	return dates;
}

async function getTabDateGlobal(): Promise <string[]> {

	const season: number = await getFirstSeason();
	const beginDate: Date = await getSeasonStartedAtById(season);
	const actualDate: Date = await getActualDate();

	const beginDateInMs:number = beginDate.getTime();
	const actualDateInMs:number = actualDate.getTime();

	const intervaleDateInMs: number = (actualDateInMs - beginDateInMs) / (NB_CHART_POINT - 1);

	const dates: string[] = [];

	for (let i = 0; i < NB_CHART_POINT; i++) {
		const pointDate = new Date(beginDateInMs + (intervaleDateInMs * i));
		dates.push(pointDate.toString());
	}

	return dates;
}

async function getWinrateChartBySeason(season: number, user: string): Promise <WinrateChart> {
	const dates: string[] = await getTabDateBySeason(season);
	return await getWinrateBySeasonAndDate(season, user, dates);
}

async function getGoalChartBySeason(season: number, user: string): Promise <GoalChart> {
	const dates: string[] = await getTabDateBySeason(season);
	return await getGoalAverageBySeasonAndDate(season, user, dates);
}

async function getRatingEloBySeason(user: string, season: number): Promise<number> {
	const elo: Elo = await getElo(user, season);
	return elo.r;
}

async function getWinrateChartGlobal(user: string): Promise <WinrateChart> {
	const dates: string[] = await getTabDateGlobal();
	return await getWinrateGlobalAndDate(user, dates);
}

async function getGoalChartGlobal(user: string): Promise <GoalChart> {
	const dates: string[] = await getTabDateGlobal();
	return await getGoalAverageGlobalAndDate(user, dates);
}

async function getRatingLastElo(user: string): Promise<number> {
	const lastSeason: number = await getCurrentSeason();
	const elo: Elo = await getElo(user, lastSeason);
	return elo.r;
}

async function getUserDashboardInfosBySeason(user: string, season: number): Promise<UserDashboardInfos> {
	const userInfos: UserDashboardInfos = {
		gamesPlayed: await getGamesPlayedCountBySeason(season, user),
		gamesWins: await getGamesWinsBySeason(season, user),
		gamesLooses: await getGamesLoosesBySeason(season, user),
		elo: await getRatingEloBySeason(user, season),
		goalAverage: await getGoalAverageBySeason(season, user),
		durationAverage: await getGameTimeAverageBySeason(season, user) ,
		preferedBall: await getPreferedBallBySeason(season, user),
		preferedMap: await getPreferedMapBySeason(season, user),
		eloChart: await getEloChartBySeason(season, user),
		winrateChart: await getWinrateChartBySeason(season, user),
		goalChart: await getGoalChartBySeason(season, user)
	};
	return userInfos;
}

async function getUserDashboardInfosGlobal(user: string): Promise<UserDashboardInfos> {
	const userInfos: UserDashboardInfos = {
		gamesPlayed: await getGamesPlayedCountGlobal(user),
		gamesWins: await getGamesWinsGlobal(user),
		gamesLooses: await getGamesLoosesGlobal(user),
		elo: await getRatingLastElo(user),
		goalAverage: await getGoalAverageGlobal(user),
		durationAverage: await getGameTimeAverageGlobal(user) ,
		preferedBall: await getPreferedBallGlobal(user),
		preferedMap: await getPreferedMapGlobal(user),
		eloChart: await getEloChartGlobal(user),
		winrateChart: await getWinrateChartGlobal(user),
		goalChart: await getGoalChartGlobal(user)
	};
	return userInfos;
}

async function getPlayerStats(req: FastifyRequest<{ Body: UserDashboardInfoBody }>, reply: FastifyReply): Promise<void> {
	const user = req.body?.user;
	if (!user) {
		sendReply(reply, Errors.NO_USER_GIVEN);
		return;
	}
	const season = req.body?.season;
	if (!season) {
		sendReply(reply, Errors.NO_SEASON_GIVEN);
		return;
	}
	let userInfos: UserDashboardInfos;
	if (season === -1)
		userInfos = await getUserDashboardInfosGlobal(user); 
	else
		userInfos = await getUserDashboardInfosBySeason(user, season);
	sendReply(reply, Success.USER_DASHBOARD_INFOS, JSON.stringify(userInfos));
}

async function geCurrentSeasonInfo(req: FastifyRequest, reply: FastifyReply): Promise<void> {
	const numberSeason : number = await getCurrentSeason();
	sendReply(reply, Success.CURRENT_SEASON, JSON.stringify(numberSeason));
}

export { WinrateChart, GoalChart, UserDashboardInfoBody, getPlayerStats, getRatingLastElo, geCurrentSeasonInfo };
