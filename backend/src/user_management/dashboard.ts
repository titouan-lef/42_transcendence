import { FastifyRequest, FastifyReply } from "fastify";
import { sendReply } from "../utils/HTTP.js";
import { Errors, Success } from "#shared/status_codes.js";
import { getGamesLoosesBySeason, getGamesPlayedCount, getGamesWinsBySeason } from "../database/fetchGame";
import { BallOption, MapOption } from "#shared/types_transfert.js";
import { getEloVariatonBySeason, getGameTimeAverageBySeason, getGoalAverageBySeason, getGoalAveragebySeasonAndDate, getPreferedBallBySeason, getPreferedMapBySeason, getWinrateBySeasonAndDate } from "src/database/fetchStats";
import { getElo } from "src/database/web3/contract_service";
import { Elo } from '../tournament/elo/elo.js';
import { getAllSeasonId, getSeasonstartedATById } from "src/database/season";
import { DEFAULT_RATINGS } from "src/tournament/elo/elo";
import { getActualDate } from "src/database/db_utils";

interface EloChart {
	dateList: string[];
	eloList: number[];
}

interface WinrateChart {
	dateList: string[];
	winrateList: number[];
}

interface GoalChart {
	dateList: string[];
	goalList: number[];
}

interface UserInfos {
	gamesPlayed: number;
	gamesWins: number;
	gamesLooses: number; 
	elo: number;
	goalAverage: number;
	durationAverage: number;//(in seconds)
	preferedBall: BallOption;
	preferedMap: MapOption;
	eloChart: EloChart;
	winrateChart: WinrateChart;
	goalChart: GoalChart;
}

interface UserInfoBody {
	user: string;
	season: number;
}

const NB_CHART_POINT = 7;


async function getEloChart(season: number, user: string):Promise <EloChart> {

	const eloVariaton = await getEloVariatonBySeason(season, user);
	if (eloVariaton?.length === 0)
		return { dateList: [], eloList: [] };

	const idSeasonTab: number[] = await getAllSeasonId();
	if (idSeasonTab.length === 0)
		return { dateList: [], eloList: [] };

	let lastSeasonElo = -1;
	for (let i = 1; i < idSeasonTab.length; i++) {
		const tmpElo: number = await getRatingElo(user, idSeasonTab[i]);
		if (tmpElo !== 0) {
			lastSeasonElo = tmpElo;
			break;
		}
	}
	if (lastSeasonElo === -1)
		lastSeasonElo = DEFAULT_RATINGS;

	const eloChart: EloChart = { dateList: [], eloList: [] };
	for (const eloHistory of eloVariaton) {
		lastSeasonElo += eloHistory.variation;
		eloChart.dateList.push(eloHistory.date);
		eloChart.eloList.push(lastSeasonElo);
	}

	return eloChart;
}


async function getTabDate(season: number): Promise <string[]> {

	const beginDate: Date = await getSeasonstartedATById(season);
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

async function getWinrateChart(season: number, user: string): Promise <WinrateChart> {
	const dates: string[] = await getTabDate(season);
	return await getWinrateBySeasonAndDate(season, user, dates);
}

async function getGoalChart(season: number, user: string): Promise <GoalChart> {
	const dates: string[] = await getTabDate(season);
	return await getGoalAveragebySeasonAndDate(season, user, dates);
}

async function getRatingElo(user: string, season: number): Promise<number> {
	const elo: Elo = await getElo(user, season);
	return elo.r;
}

async function getUserInfos(user: string, season: number): Promise<UserInfos> {
	const userInfos: UserInfos = {
		gamesPlayed: await getGamesPlayedCount(season, user),
		gamesWins: await getGamesWinsBySeason(season, user),
		gamesLooses: await getGamesLoosesBySeason(season, user),
		elo: await getRatingElo(user, season),
		goalAverage: await getGoalAverageBySeason(season, user),
		durationAverage: await getGameTimeAverageBySeason(season, user) ,
		preferedBall: await getPreferedBallBySeason(season, user),
		preferedMap: await getPreferedMapBySeason(season, user),
		eloChart: await getEloChart(season, user),
		winrateChart: await getWinrateChart(season, user),
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
		sendReply(reply, Errors.REQUEST_FAILED, "Season doesn't exist");
		return;
	}
	const userInfos: UserInfos = await getUserInfos(user, season);
	sendReply(reply, Errors.REQUEST_FAILED, JSON.stringify(userInfos));
}

export { WinrateChart, GoalChart };
