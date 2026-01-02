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

export { EloChart, WinrateChart, GoalChart };
