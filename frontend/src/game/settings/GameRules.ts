import { getSafeElement } from "../../utils/getSafeElement";
import { BallOption, MapOption } from "#shared/types_transfert.js";
import { GameTypes } from "../../routes/navigate_types";

interface GameOptions {
	map: MapOption[];
	ball: BallOption[];
	rotatingPlayer: boolean;
	spin: boolean;
	windAffectsBall: boolean;
	dashingPlayer: boolean;
	canonCount: number;
}

const DEFAULT_RULES: GameOptions = {
	map: ["default"],
	ball: ["default"],
	rotatingPlayer: false,
	spin: false,
	windAffectsBall: false,
	dashingPlayer: false,
	canonCount: 0
};

const LOCAL_RULES: GameOptions = DEFAULT_RULES;
const AI_RULES: GameOptions = DEFAULT_RULES;
const RANKED_RULES: GameOptions = DEFAULT_RULES;

function getGameOptions(gameType: GameTypes): GameOptions {
	switch (gameType) {
		case GameTypes.LOCAL:
			return LOCAL_RULES ;
		case GameTypes.AI:
			return AI_RULES;
		case GameTypes.RANKED:
			return RANKED_RULES;
		default:
			throw new Error("No such game type");
	}
}

function registerGameOptions(gameType: GameTypes): void {
	const balls: BallOption[] = [];
	const maps: MapOption[] = [];

	getSafeElement('chk-map', HTMLElement).querySelectorAll('*[id]').forEach(map => {
		if (map instanceof HTMLInputElement && map.checked) {
			if (map.value === 'default' || map.value === 'sky' || map.value === 'volcano' || map.value === 'desert') {
				maps.push(map.value);
			}
		}
	});
	getSafeElement('chk-ball', HTMLElement).querySelectorAll('*[id]').forEach(ball => {
		if (ball instanceof HTMLInputElement && ball.checked) {
			if (ball.value === 'default' || ball.value === 'snake' || ball.value === 'invisible' || ball.value === 'tricky' || ball.value === 'pulse')
				balls.push(ball.value);
		}
	});
	if (maps.length === 0)
		throw new Error("Empty maps options");
	if (balls.length === 0)
		throw new Error("Empty balls options");

	const rules = getGameOptions(gameType);
	rules.map = maps;
	rules.ball = balls;
	rules.spin = getSafeElement(`chk-rule-spin`, HTMLInputElement).checked;
	rules.windAffectsBall = getSafeElement(`chk-rule-wind`, HTMLInputElement).checked;
	rules.rotatingPlayer = getSafeElement(`chk-rule-prot`, HTMLInputElement).checked;
	rules.dashingPlayer = getSafeElement(`chk-rule-dash`, HTMLInputElement).checked;
	rules.canonCount = Number(getSafeElement(`canon-nbr`, HTMLInputElement).value);
}

function loadCheckboxes(gameType: GameTypes): void {
	const rules = getGameOptions(gameType);
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

export { registerGameOptions, getGameOptions, loadCheckboxes };
