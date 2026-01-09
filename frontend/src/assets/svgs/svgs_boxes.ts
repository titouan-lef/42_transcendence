import { SVG_BALL_DEFAULT, SVG_BALL_INVISIBLE, SVG_BALL_PULSE, SVG_BALL_SNAKE, SVG_BALL_TRICKY, SVG_MAP_DEFAULT, SVG_MAP_DESERT, SVG_MAP_SKY, SVG_MAP_VOLCANO } from "./svgs";
import { MapOption, BallOption } from "#shared/types_transfert.js";

const SVG_SELECTED_STYLE = `
hidden peer-checked:flex
absolute -top-2 -right-2 z-10
w-5 h-5 rounded-full
bg-[var(--color-variant)] text-dark
items-center justify-center shadow-md
`;

const SVG_SELECTED = `
<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
</svg>
`;

const SVG_BOX_STYLE = `
shrink-0
w-full h-full rounded-2xl
bg-dark border-2 border-darker text-darker
flex items-center justify-center
group-hover:border-darker
peer-checked:border-variant
peer-checked:text-variant
peer-checked:bg-variant/10
peer-checked:shadow-lg peer-checked:shadow-variant/20
`;

function createCheckbox(id: string, svg: string, value?: string): string {
	return `
	<label class="relative group w-12 h-12 select-none">
		<input id='${id}' type="checkbox" value='${value ?? ''}' class="peer sr-only"/>
		<div class="${SVG_BOX_STYLE}">
			${svg}
		</div>
		<div class="${SVG_SELECTED_STYLE}">
			${SVG_SELECTED}
		</div>
	</label>
	`;
}


function createSvgBox(svg: string): string {
	const svgBoxStyle = `
	w-8 h-8 rounded-2xl
	bg-dark border-2 border-variant text-variant
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

export { createCheckbox, createSvgBox, createSvgBoxByBall, createSvgBoxByMap };
