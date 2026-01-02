import { BallOption, MapOption } from "./types_transfert";
import { EloChart, WinrateChart, GoalChart } from "./types_dashboard";

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
	goalChart: GoalChart;
}

export { Friend, UserDashboardInfos };
