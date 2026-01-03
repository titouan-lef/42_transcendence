import { BallOption, MapOption } from "./types_transfert";
import { EloChart, WinrateChart } from "./types_dashboard";

interface Friend {
	username: string,
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

export { Friend, UserDashboardInfos, GameHistory, GameHistoryWithAvatar };
