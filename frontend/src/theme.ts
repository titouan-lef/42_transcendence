export enum Themes {
	PIZZA_LULU = "pizza_lulu",
	OVER_TITOUAN = "over_titouan",
	SUGAR_RUSHTMAN = "sugar_rushtman",
	POLYBIUS = "polybius",
	NEON_HEARTS = "neon_hearts",
	CLAW_MACHINE = "claw_machine",
	LAZER_TIM = "lazer_tim",
	ELECTRONIC_ECLYPSE = "electronic_eclypse",
	PLEASE_INSERT_25C = "please_insert_25c",
	TICKET_MUNCHER = "ticket_muncher",
	ELECTRIC_PL = "electric_pl",
	MONQ = "monq",
}

export function setTheme(theme: Themes): void {
	if (Object.values(Themes).includes(theme)) {
		document.body.dataset.theme = theme;
	}
}

function initTheme(): void {
	const randomTheme = Object.values(Themes);
	const randomIndex = Math.floor(Math.random() * Object.values(Themes).length);
	document.body.dataset.theme = randomTheme[randomIndex];
}

initTheme();
// setInterval(initTheme, 100);
