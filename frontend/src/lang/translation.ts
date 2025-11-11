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
	profile: {
		en: "profile",
		fr: "profil",
	},
	user_name: {
		en: "username",
		fr: "nom d'utilisateur",
	},
	sign_in: {
		en: "sign in",
		fr: "se connecter"
	},
	continue_as_guest: {
		en: "continue as guest",
		fr: "continuer en tant qu'invité"
	},
	sign_up: {
		en: "sign up",
		fr: "s'inscrire"
	},
	nick_name: {
		en: "nick name",
		fr: "pseudo"
	},
	confirm: {
		en: "confirm",
		fr: "confirmer"
	},
	confirm_password: {
		en: "{confirm} {password}",
		fr: "{confirm} le {password}"
	},
	go_back: {
		en: "go back",
		fr: "revenir"
	},
} as const satisfies Record<string, Expression>;

export { CodeLang, TRANSLATOR };
