// import { GameStats } from "#shared/types_transfert.js";
import { loadModularPage } from "src/pages/modular";
import { closeDialogID, loadDialog } from "./dialog";
import { DIALOG_BTN_STYLE, DIALOG_SEPARATOR_STYLE } from "./dialog_style";
import { getSafeElement } from "src/utils/getSafeElement";
import { openProfile } from "../profile/profile";
import { openDialogGameSelector, playGame } from "./dialog_game_selector";
import { SVG_BALL_DEFAULT, SVG_BALL_INVISIBLE, SVG_BALL_PULSE, SVG_BALL_SNAKE, SVG_BALL_TRICKY, SVG_MAP_DEFAULT, SVG_MAP_DESERT, SVG_MAP_SKY, SVG_MAP_VOLCANO, SVG_RULE_DASH, SVG_RULE_PROT, SVG_RULE_SPIN, SVG_RULE_WIND } from "./dialog_game_options_svgs";
import { Ball } from "src/game/ball/Ball";

type MapOption = "default" | "volcano" | "sky" | "desert";
type BallOption = "default" | "invisible" | "tricky" | "pulse" | "snake" | "canon";

interface Point {
	ball: BallOption,
	map: MapOption,
	timer: number,
	goaler: 1 | 2
}

interface Rules {
	ballOptions: BallOption[],
	mapOptions: MapOption[],
	rotatingPlayer: boolean,
	spin: boolean,
	dashingPlayer: boolean,
	windAffectsBall: boolean,
	canonCount: number
}

interface PlayerInfo {
	name: string,
	score: number
}

interface GameStats {
	player1: PlayerInfo,
	player2: PlayerInfo,
	gameTimer: number,
	points: Point[],
	rules: Rules
}

let stats: GameStats;

const GAME_DASHBOARD_BUTTONS = `
<div class='flex flex-row gap-3'>
	<button id='btn-replay' class='${DIALOG_BTN_STYLE}'>replay</button>
	<button id='btn-back-rules' class='${DIALOG_BTN_STYLE}'>change rules</button>
	<button id='btn-profile' class='${DIALOG_BTN_STYLE}'>profile</button>
</div>
`;

function formatTime(time: number, verbose = true): string {
	if (!verbose)
		return `${~~(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
	return `${~~(time / 60)} min ${(time % 60).toString().padStart(2, '0')} sec`;
}

function formatScore(stats: GameStats): string {
	return `${stats.player1.name} [ ${stats.player1.score} | ${stats.player2.score} ] ${stats.player2.name}`;
}

function generateGameDashboard(): string {
	const stats = getGameStats();

	return `
		<div class='flex flex-col gap-4'>
			<div class='flex flex-row'>
				<div>Game duration :</div>
				<div>${formatTime(stats.gameTimer)}</div>
			</div>
			<div class='flex flex-row'>
				<div>Score :</div>
				<div>${formatScore(stats)}</div>
				<div>
					<button id='btn-more' class='${DIALOG_BTN_STYLE}'>see more</button>
					<div id='show-more' class='${POINT_STYLE}'></div>
				</div>
			</div>
			<div>
				<button id='btn-show-rules' class='${DIALOG_BTN_STYLE}'>show game rules</button>
			</div>
		</div>
		<hr class="${DIALOG_SEPARATOR_STYLE}">
		${GAME_DASHBOARD_BUTTONS}
	`;
}

function gameDashboardEvents(): void {
	const allElements = getSafeElement('modal', HTMLDialogElement).querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-more':
				elem.addEventListener('click', showPoints);
				break;
			case 'btn-show-rules':
				elem.addEventListener('click', showRules);
				break;
			case 'btn-replay':
				elem.addEventListener('click', gameDashboardReplayEvent);
				break;
			case 'btn-back-rules':
				elem.addEventListener('click', openDialogGameSelector);
				break;
			case 'btn-profile':
				elem.addEventListener('click', gameDashboardProfileEvent);
				break;
			default:
				break;
		}
	});
}

function showPoints(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	const gameType = modal.dataset.gametype;
	loadDialog(generatePointList(), gameDashboardBtnBackEvents);
	modal.dataset.gametype = gameType;
}

function showRules(): void {
	const modal = getSafeElement('modal', HTMLDialogElement);
	const gameType = modal.dataset.gametype;
	loadDialog(generateRules(), gameDashboardBtnBackEvents);
	modal.dataset.gametype = gameType;
}

function gameDashboardBtnBackEvents(): void {
	getSafeElement('btn-back', HTMLElement).addEventListener('click', () => openDialogGameDashboard(getGameStats()));
}

function generateMapList(maps: MapOption[]): string {
	let mapdiv = '';

	maps.forEach(map => {
		mapdiv += createSvgBoxByMap(map);
	});

	return mapdiv;
}

function generateBallList(balls: BallOption[]): string {
	let balldiv = '';

	balls.forEach(ball => {
		balldiv += createSvgBoxByBall(ball);
	});

	return balldiv;
}

function generateRules(): string {
	const stats = getGameStats();

	return `
		<div class='flex flex-row gap-4'>
			maps : ${generateMapList(stats.rules.mapOptions)}
		</div>
		<div class='flex flex-row gap-4'>
			balls : ${generateBallList(stats.rules.ballOptions)}
		</div>
		<div class='flex flex-row gap-4'>
			rules :
			${stats.rules.dashingPlayer ? createSvgBox(SVG_RULE_DASH) : ``}
			${stats.rules.rotatingPlayer ? createSvgBox(SVG_RULE_PROT) : ``}
			${stats.rules.spin ? createSvgBox(SVG_RULE_SPIN) : ``}
			${stats.rules.windAffectsBall ? createSvgBox(SVG_RULE_WIND) : ``}
		</div>
		<div class=''>
			canon number : ${stats.rules.canonCount}
		</div>
		<hr class="${DIALOG_SEPARATOR_STYLE}">
		<button id='btn-back' class='${DIALOG_BTN_STYLE}'>back</button>
	`;
}

function createSvgBox(svg: string): string {
	const svgBoxStyle = `
	w-6 h-6 rounded-2xl
	bg-dark border-2 border-darker text-darker
	flex items-center justify-center
	`;

	const svgBox = `
	<div class="${svgBoxStyle}">
		${svg}
	</div>
	`;

	return svgBox;
}

function createSvgBoxByBall(ball: BallOption): string {
	switch (ball) {
		case "default":
			return createSvgBox(SVG_BALL_DEFAULT);
		case "invisible":
			return createSvgBox(SVG_BALL_INVISIBLE);
		case "tricky":
			return createSvgBox(SVG_BALL_TRICKY);
		case "pulse":
			return createSvgBox(SVG_BALL_PULSE);
		case "snake":
			return createSvgBox(SVG_BALL_SNAKE);
		default:
			return createSvgBox(SVG_BALL_DEFAULT);
	}
}

function createSvgBoxByMap(map: MapOption): string {
	switch (map) {
		case "default":
			return createSvgBox(SVG_MAP_DEFAULT);
		case "volcano":
			return createSvgBox(SVG_MAP_VOLCANO);
		case "sky":
			return createSvgBox(SVG_MAP_SKY);
		case "desert":
			return createSvgBox(SVG_MAP_DESERT);
		default:
			return createSvgBox(SVG_MAP_DEFAULT);
	}
}

function gameDashboardReplayEvent(): void {
	const gameType = getSafeElement('modal', HTMLDialogElement).dataset.gametype;

	if (gameType && (gameType === 'local' || gameType === 'ai' || gameType === 'ranked'))
		playGame(gameType);
}

function gameDashboardProfileEvent(): void {
	closeDialogID('modal');
	openProfile();
}

function openDialogGameDashboard(stats: GameStats): void {
	const saveGameType = getSafeElement('modal', HTMLDialogElement).dataset.gametype;
	setGameStats(stats);

	loadModularPage();
	loadDialog(generateGameDashboard(), gameDashboardEvents);
	getSafeElement('modal', HTMLDialogElement).dataset.gametype = saveGameType;
}

function setGameStats(data: GameStats): void {
	stats = data;
}

function getGameStats(): GameStats {
	return stats;
}

const POINT_STYLE = `
`;

function formatPoint(point: Point, goaler: string): string {
	return `[${formatTime(point.timer, false)}] ${goaler} scored! (${createSvgBoxByBall(point.ball)},${createSvgBoxByMap(point.map)})`;
}

function generatePointList(): string {
	const stats = getGameStats();
	const points = stats.points;

	let pointList = `<div class='flex flex-col'>`;

	points.forEach(point => {
		pointList += `
		<div class='${POINT_STYLE}'>
			${formatPoint(point, point.goaler === 1 ? stats.player1.name : stats.player2.name)}
		</div>
		`;
	});

	return `
	${pointList}
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	<button id='btn-back' class='${DIALOG_BTN_STYLE}'>back</button>
	</div>`;
}

export { openDialogGameDashboard, setGameStats };
