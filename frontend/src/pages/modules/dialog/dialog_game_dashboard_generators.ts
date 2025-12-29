import { formatPoint, getGameStats } from "./dialog_game_dashboard_utils";
import { SVG_RULE_DASH, SVG_RULE_PROT, SVG_RULE_SPIN, SVG_RULE_WIND } from "./dialog_game_svgs";
import { createSvgBox, createSvgBoxByBall, createSvgBoxByMap } from "./dialog_game_svgs_boxes";
import { DIALOG_BTN_STYLE, DIALOG_SEPARATOR_STYLE } from "./dialog_style";
import { MapOption, BallOption, Rules } from "#shared/types_transfert.js";

const POINT_STYLE = `
`;

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
			rules : ${generateRulesList(stats.rules)}
		</div>
		<div class=''>
			canon number : ${stats.rules.canonCount}
		</div>
		<hr class="${DIALOG_SEPARATOR_STYLE}">
		<button id='btn-back' class='${DIALOG_BTN_STYLE}'>back</button>
	`;
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

function generateRulesList(rules: Rules): string {
	return `
	${rules.dashingPlayer ? createSvgBox(SVG_RULE_DASH) : ``}
	${rules.rotatingPlayer ? createSvgBox(SVG_RULE_PROT) : ``}
	${rules.spin ? createSvgBox(SVG_RULE_SPIN) : ``}
	${rules.windAffectsBall ? createSvgBox(SVG_RULE_WIND) : ``}
	`;
}

export { generatePointList, generateRules };
