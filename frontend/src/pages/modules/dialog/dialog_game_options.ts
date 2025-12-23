import { createCheckbox } from "./dialog_game_options_checkbox";
import { SVG_BALL_DEFAULT, SVG_BALL_INVISIBLE, SVG_BALL_PULSE, SVG_BALL_SNAKE, SVG_BALL_TRICKY, SVG_CANON, SVG_MAP_DEFAULT, SVG_MAP_DESERT, SVG_MAP_SKY, SVG_MAP_VOLCANO, SVG_RULE_DASH, SVG_RULE_PROT, SVG_RULE_SPIN, SVG_RULE_WIND } from "./dialog_game_options_svgs";
import { DIALOG_BTN_STYLE, DIALOG_SEPARATOR_STYLE } from "./dialog_style";

/** @todo front */
const GAME_OPTIONS_MAPS = `
<div class='flex flex-row gap-4'>
	<div class='text-20 font-bold'>
		select maps
	</div>
	<div id='chk-map' class='flex flex-row gap-4'>
		${createCheckbox('chk-map-default', SVG_MAP_DEFAULT, 'default')}
		${createCheckbox('chk-map-volcano', SVG_MAP_VOLCANO, 'volcano')}
		${createCheckbox('chk-map-sky', SVG_MAP_SKY, 'sky')}
		${createCheckbox('chk-map-desert', SVG_MAP_DESERT, 'desert')}
	</div>
</div>
`;

const GAME_OPTIONS_BALLS = `
<div class='flex flex-row gap-4'>
	<div class='text-20 font-bold'>
		select balls
	</div>
	<div id='chk-ball' class='flex flex-row gap-4'>
		${createCheckbox('chk-ball-default', SVG_BALL_DEFAULT, 'default')}
		${createCheckbox('chk-ball-invisible', SVG_BALL_INVISIBLE, 'invisible')}
		${createCheckbox('chk-ball-pulse', SVG_BALL_PULSE, 'pulse')}
		${createCheckbox('chk-ball-snake', SVG_BALL_SNAKE, 'snake')}
		${createCheckbox('chk-ball-tricky', SVG_BALL_TRICKY, 'tricky')}
	</div>
</div>
`;

const GAME_OPTIONS_RULES = `
<div class='flex flex-row gap-4'>
	<div class='text-20 font-bold'>
		rules
	</div>
	<div class='flex flex-row gap-4'>
		${createCheckbox('chk-rule-dash', SVG_RULE_DASH)}
		${createCheckbox('chk-rule-prot', SVG_RULE_PROT)}
		${createCheckbox('chk-rule-spin', SVG_RULE_SPIN)}
		${createCheckbox('chk-rule-wind', SVG_RULE_WIND)}
	</div>
</div>
`;

const GAME_OPTIONS_CANON = `
<div class='flex flex-row gap-4'>
	<div class='text-20 font-bold'>
		canon numbers
	</div>
	${SVG_CANON}
	<div class='flex flex-row gap-4'>
		<input type="range" id="canon-nbr" name="canon-nbr" value="0" min="0" max="2"/>
	</div>
</div>
`;

const GAME_OPTIONS = `
	<div class="flex flex-col gap-4 p-10">
		${GAME_OPTIONS_MAPS}
		${GAME_OPTIONS_BALLS}
		${GAME_OPTIONS_RULES}
		${GAME_OPTIONS_CANON}
	</div>
	<hr class="${DIALOG_SEPARATOR_STYLE}">
	<button id='btn-back' class='${DIALOG_BTN_STYLE}'>back</button>
	<button id='btn-go' class='${DIALOG_BTN_STYLE}'>GO</button>
`;


export { GAME_OPTIONS };
