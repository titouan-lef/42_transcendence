import { MapOption, BallOption, Rules } from "#shared/types_transfert.js";
import { SVG_CANON, SVG_RULE_DASH, SVG_RULE_PROT, SVG_RULE_SPIN, SVG_RULE_WIND } from "../../../assets/svgs/svgs";
import { createSvgBox, createSvgBoxByBall, createSvgBoxByMap } from "../../../assets/svgs/svgs_boxes";
import { formatPoint, getGameStats } from "./box_main_dashboard_utils";

const POINT_BOX_STYLE = `
flex flex-col justify-start items-start gap-2 min-h-0 w-full h-full bg-dark/20 rounded-2xl scrollbar-none overflow-scroll p-2
`;

const POINT_STYLE = `
flex flex-row gap-2 w-full text-[20px] h-full
`;

function generatePointList(): string {
	const stats = getGameStats();
	const points = stats.points;

	let pointList = `<div class='${POINT_BOX_STYLE}'>`;

	points.forEach(point => {
		pointList += `
		<div class='${POINT_STYLE}'>
			${formatPoint(point, point.goaler === 1 ? stats.player1.name : stats.player2.name)}
		</div>
		`;
	});

	return `
		${pointList}
		</div>
	`;
}

function generateRules(): string {
	const stats = getGameStats();

	return `
	<div class='flex flex-col h-full gap-2 w-full'>
		<div class='text-2xl font-bold p-8'>game's ruleset</div>
		<div class='bg-dark/20 rounded-2xl p-4 flex flex-col h-full gap-2 w-full'>
			<div class='flex flex-row gap-4 min-h-8'>
				${generateMapList(stats.rules.mapOptions)}
			</div>
			<div class='flex flex-row gap-4 min-h-8'>
				${generateBallList(stats.rules.ballOptions)}
			</div>
			<div class='flex flex-row gap-4 min-h-8'>
				${generateRulesList(stats.rules)}
			</div>
			<div class='flex flex-row gap-4 text-variant w-fit min-h-8'>
				${SVG_CANON} : ${stats.rules.canonCount}
			</div>
		</div>
	</div>
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
