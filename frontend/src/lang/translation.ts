type CodeLang = 'fr' | 'en';

type Expression = Record<CodeLang, string>;

// 'as const' allows you to make fields read-only and avoid adding/removing fields.
// 'satisfies ...' allows you to detect errors if a field doesn't exist (or is badly written).
const TRANSLATOR = {
	play: {
		en: "play",
		fr: "jouer",
	},
	game: {
		en: "game",
		fr: "jeu",
	},
	change: {
		en: "change",
		fr: "changer",
	},
	password: {
		en: "password",
		fr: "mot de passe",
	},
	change_password: {
		en: "{change} {password}",
		fr: "{change} de {password}",
	},
} as const satisfies Record<string, Expression>;

export { CodeLang, TRANSLATOR };