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
	nickname: {
		en: "nickname",
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
	log_out: {
		en: "log out",
		fr: "se déconnecter"
	},
	add_friend: {
		en: "add friend",
		fr: "ajouter un ami"
	},
	invite: {
		en: "invite",
		fr: "inviter"
	},
	delete: {
		en: "delete",
		fr: "supprimer"
	},
	settings: {
		en: "settings",
		fr: "paramètres"
	},
	history: {
		en: "history",
		fr: "historique"
	},
	summary: {
		en: "summary",
		fr: "résumé"
	},
	dashboard: {
		en: "dashboard",
		fr: "tableau de bord"
	},
	see_more: {
		en: "see more",
		fr: "voir plus"
	},
	elo: {
		en: "elo",
		fr: "elo"
	},
	prefered_map: {
		en: "prefered map",
		fr: "map favorite"
	},
	prefered_ball: {
		en: "prefered ball",
		fr: "balle favorite"
	},
	last_games: {
		en: "last games",
		fr: "dernières parties"
	},
} as const satisfies Record<string, Expression>;

export { CodeLang, TRANSLATOR };
