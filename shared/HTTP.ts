import { BallOption, MapOption } from "./types_transfert";
import { ReplyStatus } from "./status_codes";

// FRONT to BACK
interface UserBody {
	user?: string;
}

interface ThemeBody {
	theme: string;
}

interface NewUserBody {
	username: string;
	nickname: string;
	password: string;
}

interface Content2FA {
	user: string;
	code: number;
};

interface UserDashboardInfoBody {
	user: string;
	season: number;
}

// BACK to FRONT
interface ReplyFromBack {
	code: ReplyStatus
	content: string
}

interface Friend {
	username: string,
	nickname: string,
	onlineStatus: boolean
}

interface DataChartType {
	x: number,
	y: number
}

interface UserDashboardInfos {
	gamesPlayed: number;
	gamesWins: number;
	gamesLooses: number; 
	elo: number;
	goalAverage: number;
	durationAverage: number;//(in seconds)
	preferedBall: BallOption;
	preferedMap: MapOption;
	eloChart: DataChartType[];
	winrateChart: DataChartType[];
}

interface GameHistory {
	date: string;
	duration: number;
	season: number;
	opponentUsername: string;
	opponentNickname: string;
	eloVariation: number;
	myScore: number;
	opponentScore: number;
}

interface GameHistoryWithAvatar extends GameHistory {
	isAvatarSet: Boolean;
}

interface Ranking {
	username: string;
	nickname: string;
	rating: number;
	winrate: number;
	nbGamePlayed: number;
}

interface LeaderboardInfos {
	ranking: Ranking[];
	beginDate: string;
	endDate: string;
}

export { UserBody, ThemeBody, NewUserBody, Content2FA, UserDashboardInfoBody };
export { ReplyFromBack, Friend, DataChartType, UserDashboardInfos, Ranking, GameHistory, GameHistoryWithAvatar, LeaderboardInfos };
