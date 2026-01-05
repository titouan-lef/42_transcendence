import { BallOption, MapOption } from "./types_transfert";
import { EloChart, WinrateChart } from "./types_dashboard";

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
interface Friend {
	username: string,
	nickname: string,
	onlineStatus: boolean
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
	eloChart: EloChart;
	winrateChart: WinrateChart;
}

interface GameHistory {
	date: string;
	duration: number;
	season: number;
	opponent: string;
	elo_variation: number;
	my_score: number;
	opponent_score: number;
}

interface GameHistoryWithAvatar extends GameHistory {
	isAvatarSet: Boolean;
}

interface GameHistory {
	date: string;
	duration: number;
	season: number;
	opponent: string;
	elo_variation: number;
	my_score: number;
	opponent_score: number;
}

interface GameHistoryWithAvatar extends GameHistory {
	isAvatarSet: Boolean;
}

interface Ranking {
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
export { Friend, UserDashboardInfos, Ranking, GameHistory, GameHistoryWithAvatar, LeaderboardInfos };
