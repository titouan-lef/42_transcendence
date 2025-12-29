import { getSafeElement } from "../../utils/getSafeElement";
import { BallOption, MapOption } from "#shared/types_transfert.js";

interface GameOptions {
	map: MapOption[];
	ball: BallOption[];
	rotatingPlayer: boolean;
	spin: boolean;
	windAffectsBall: boolean;
	dashingPlayer: boolean;
	canonCount: number;
}

const LOCAL_RULES: GameOptions = {
	map: ["default", "sky", "volcano"],
	ball: ["default", "snake", "tricky", "invisible", "pulse"],
	rotatingPlayer: true,
	spin: true,
	windAffectsBall: true,
	dashingPlayer: true,
	canonCount: 1
};

const AI_RULES: GameOptions = {
	map: ["sky"],
	ball: ["default", "tricky", "invisible", "pulse"],
	rotatingPlayer: false,
	spin: true,
	windAffectsBall: true,
	dashingPlayer: true,
	canonCount: 2
};

const RANKED_RULES: GameOptions = {
	map: ["default", "sky", "volcano", "desert"],
	ball: ["default", "snake", "tricky", "invisible", "pulse"],
	rotatingPlayer: true,
	spin: true,
	windAffectsBall: true,
	dashingPlayer: true,
	canonCount: 1
};

function setGameOptions(rules: GameOptions): void {
	const balls: BallOption[] = [];
	const maps: MapOption[] = [];

	try {
		const getMaps = getSafeElement('chk-map', HTMLElement);
		getMaps.querySelectorAll('*[id]').forEach(map => {
			if (map instanceof HTMLInputElement && map.checked) {
				if (map.value === 'default' || map.value === 'sky' || map.value === 'volcano' || map.value === 'desert') {
					maps.push(map.value);
				}
			}
		});
		const getBalls = getSafeElement('chk-ball', HTMLElement);
		getBalls.querySelectorAll('*[id]').forEach(ball => {
			if (ball instanceof HTMLInputElement && ball.checked) {
				if (ball.value === 'default' || ball.value === 'snake' || ball.value === 'invisible' || ball.value === 'tricky' || ball.value === 'pulse')
					balls.push(ball.value);
			}
		});
		if (maps.length === 0)
			maps.push('default');
		if (balls.length === 0)
			balls.push('default');
		rules.map = maps;
		rules.ball = balls;
		rules.spin = getSafeElement(`chk-rule-spin`, HTMLInputElement).checked;
		rules.windAffectsBall = getSafeElement(`chk-rule-wind`, HTMLInputElement).checked;
		rules.rotatingPlayer = getSafeElement(`chk-rule-prot`, HTMLInputElement).checked;
		rules.dashingPlayer = getSafeElement(`chk-rule-dash`, HTMLInputElement).checked;
		rules.canonCount = +getSafeElement(`canon-nbr`, HTMLInputElement).value;
	} catch {
		console.log('not ruleset found, last rules or default applied'); /** @todo better to do for replay button ? */
	}
}

function loadCheckboxes(rules: GameOptions): void {
	rules.map.forEach(map => {
		getSafeElement(`chk-map-${map}`, HTMLInputElement).checked = true;
	});
	rules.ball.forEach(ball => {
		getSafeElement(`chk-ball-${ball}`, HTMLInputElement).checked = true;
	});
	getSafeElement(`chk-rule-spin`, HTMLInputElement).checked = rules.spin;
	getSafeElement(`chk-rule-wind`, HTMLInputElement).checked = rules.windAffectsBall;
	getSafeElement(`chk-rule-prot`, HTMLInputElement).checked = rules.rotatingPlayer;
	getSafeElement(`chk-rule-dash`, HTMLInputElement).checked = rules.dashingPlayer;
	getSafeElement(`canon-nbr`, HTMLInputElement).value = rules.canonCount.toString();
}

export { setGameOptions, loadCheckboxes };
export { LOCAL_RULES, AI_RULES, RANKED_RULES };
