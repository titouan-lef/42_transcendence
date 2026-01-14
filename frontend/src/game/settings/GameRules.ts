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
		default:
			return RANKED_RULES;
	}
}

function registerGameOptions(gameType: GameTypes): void {
	const balls: BallOption[] = [];
	const maps: MapOption[] = [];

	const elemMap = getSafeElement('chk-map', HTMLElement);
	if (!elemMap)
		return;
	elemMap.querySelectorAll('*[id]').forEach(map => {
		if (map instanceof HTMLInputElement && map.checked) {
			if (map.value === 'default' || map.value === 'sky' || map.value === 'volcano' || map.value === 'desert') {
				maps.push(map.value);
			}
		}
	});
	const elemBall = getSafeElement('chk-ball', HTMLElement);
	if (!elemBall)
		return;
	elemBall.querySelectorAll('*[id]').forEach(ball => {
		if (ball instanceof HTMLInputElement && ball.checked) {
			if (ball.value === 'default' || ball.value === 'snake' || ball.value === 'invisible' || ball.value === 'tricky' || ball.value === 'pulse')
				balls.push(ball.value);
		}
	});

	const elemSpin = getSafeElement(`chk-rule-spin`, HTMLInputElement);
	const elemWind = getSafeElement(`chk-rule-wind`, HTMLInputElement);
	const elemRotation = getSafeElement(`chk-rule-prot`, HTMLInputElement);
	const elemDash = getSafeElement(`chk-rule-dash`, HTMLInputElement);
	const elemCanon = getSafeElement(`canon-nbr`, HTMLInputElement);
	if (maps.length === 0 || balls.length === 0 || !elemSpin || !elemWind || !elemRotation || !elemDash || !elemCanon)
		return;

	const rules = getGameOptions(gameType);
	rules.map = maps;
	rules.ball = balls;
	rules.spin = elemSpin.checked;
	rules.windAffectsBall = elemWind.checked;
	rules.rotatingPlayer = elemRotation.checked;
	rules.dashingPlayer = elemDash.checked;
	rules.canonCount = Number(elemCanon.value);
}

function loadCheckboxes(gameType: GameTypes): void {
	const rules = getGameOptions(gameType);
	rules.map.forEach(map => {
		const elem = getSafeElement(`chk-map-${map}`, HTMLInputElement);
		if (elem)
			elem.checked = true;
	});
	rules.ball.forEach(ball => {
		const elem = getSafeElement(`chk-ball-${ball}`, HTMLInputElement);
		if (elem)
			elem.checked = true;
	});

	const elemSpin = getSafeElement(`chk-rule-spin`, HTMLInputElement);
	const elemWind = getSafeElement(`chk-rule-wind`, HTMLInputElement);
	const elemRotation = getSafeElement(`chk-rule-prot`, HTMLInputElement);
	const elemDash = getSafeElement(`chk-rule-dash`, HTMLInputElement);
	const elemCanon = getSafeElement(`canon-nbr`, HTMLInputElement);
	
	if (elemSpin)
		elemSpin.checked = rules.spin;
	if (elemWind)
		elemWind.checked = rules.windAffectsBall;
	if (elemRotation)
		elemRotation.checked = rules.rotatingPlayer;
	if (elemDash)
		elemDash.checked = rules.dashingPlayer;
	if (elemCanon)
		elemCanon.value = rules.canonCount.toString();
}

export { registerGameOptions, getGameOptions, loadCheckboxes };
