import { Point, GameStats } from "#shared/types_transfert.js";
import { createSvgBoxByBall, createSvgBoxByMap } from "../../../assets/svgs/svgs_boxes";

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
	return `${stats.player1.score} - ${stats.player2.score}`;
}

function formatPoint(point: Point, goaler: string): string {
	return `
	<div class='shrink-0'>[${formatTime(point.timer, false)}]</div>
	<div class='max-w-[200px] truncate' title='${goaler}'> ${goaler}</div>
	<div class='shrink-0 flex flex-row'>
		<div>scored! (</div>
		${createSvgBoxByBall(point.ball)}
		<div>,</div>
		${createSvgBoxByMap(point.map)}
		<div>)</div>
	</div>
	`;
}

export { formatTime, formatScore, formatPoint };
export { setGameStats, getGameStats };
