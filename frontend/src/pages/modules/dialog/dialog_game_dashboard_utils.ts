import { Point, GameStats } from "#shared/types_transfert.js";
import { createSvgBoxByBall, createSvgBoxByMap } from "./dialog_game_svgs_boxes";

let stats: GameStats;

function setGameStats(data: GameStats): void {
	stats = data;
}

function getGameStats(): GameStats {
	return stats;
}

function formatTime(time: number, verbose = true): string {
	if (!verbose)
		return `${~~(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
	return `${~~(time / 60)} min ${(time % 60).toString().padStart(2, '0')} sec`;
}

function formatScore(stats: GameStats): string {
	return `${stats.player1.name} [ ${stats.player1.score} | ${stats.player2.score} ] ${stats.player2.name}`;
}

function formatPoint(point: Point, goaler: string): string {
	return `[${formatTime(point.timer, false)}] ${goaler} scored! (${createSvgBoxByBall(point.ball)},${createSvgBoxByMap(point.map)})`;
}

export { formatTime, formatScore, formatPoint };
export { setGameStats, getGameStats };
