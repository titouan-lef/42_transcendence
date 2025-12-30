/** @todo replace this file by something that get in back informations */

interface LeaderboardUser {
	nick: string,
	elo: number,
	wins: number,
	winrate: number
};

const LEADERBOARD_USERS: LeaderboardUser[] = [
	{ nick: 'nick1', elo: 500, wins: 42, winrate: 0.30 },
	{ nick: 'nick2', elo: 735, wins: 77, winrate: 1 },
	{ nick: 'nick3', elo: 485, wins: 66, winrate: 0.70 },
	{ nick: 'nick4', elo: 510, wins: 102, winrate: 0.53 },
	{ nick: 'nick5', elo: 525, wins: 10, winrate: 0.3 },
	{ nick: 'nick6', elo: 566, wins: 43, winrate: 0.36 },
	{ nick: 'nick7', elo: 555, wins: 42, winrate: 0.39 },
	{ nick: 'nick8', elo: 480, wins: 56, winrate: 0.57 },
	{ nick: 'nick9', elo: 395, wins: 0, winrate: 0 },
];

export { LEADERBOARD_USERS };
