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

initTheme();

export function setTheme(theme: Themes): void {
	document.body.dataset.theme = theme;
}

function initTheme(): void {
	const themeList = Object.values(Themes);
	const randomIndex = Math.floor(Math.random() * Object.values(Themes).length);
	document.body.dataset.theme = themeList[randomIndex];
}
