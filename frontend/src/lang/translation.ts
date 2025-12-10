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
	wins: {
		en: "wins",
		fr: "victoires"
	},
	loses: {
		en: "loses",
		fr: "défaites"
	},
	win_rate: {
		en: "win rate",
		fr: "ratio de victoires"
	},
	chart: {
		en: "chart",
		fr: "évolution"
	},
	win_rate_chart: {
		en: "{win_rate} {chart}",
		fr: "{chart} du {win_rate}"
	},
	games_played: {
		en: "games played",
		fr: "parties jouées"
	},
	goals_avg: {
		en: "goals average",
		fr: "moyenne des buts"
	},
	games_time: {
		en: "games time",
		fr: "temps des parties"
	},
	elo_chart: {
		en: "{elo} {chart}",
		fr: "{chart} du {elo}"
	},
	diff_goals_chart: {
		en: "goals difference chart",
		fr: "{chart} de la différence des buts"
	},
	all: {
		en: "all",
		fr: "tout"
	},
	season: {
		en: "season",
		fr: "saison",
	},
	s1: {
		en: "{season} one",
		fr: "{season} une"
	},
	s2: {
		en: "{season} two",
		fr: "{season} deux"
	},
	s3: {
		en: "{season} three",
		fr: "{season} trois"
	},
	delete_account: {
		en: "delete account",
		fr: "supprimer compte"
	},
	save: {
		en: "save",
		fr: "enregistrer"
	},
	edit: {
		en: "edit",
		fr: "modifier"
	},
	tfa: {
		en: "2FA",
		fr: "double authentification"
	},
	tfa_mail: {
		en: "{tfa} mail",
		fr: "{tfa} e-mail"
	},
	new_password: {
		en: "new password",
		fr: "nouveau mot de passe"
	},
	user_informations: {
		en: "user informations",
		fr: "informations"
	},
	change_avatar: {
		en: "change avatar",
		fr: "modifier avatar"
	},
	cancel: {
		en: "cancel",
		fr: "annuler"
	},
	options: {
		en: "options",
		fr: "paramètres"
	},
	enable: {
		en: 'enable',
		fr: 'activer'
	},
	disable: {
		en: 'disable',
		fr: 'désactiver'
	},
	enable_2fa: {
		en: '{enable} {tfa}',
		fr: '{enable} la {tfa}'
	},
	disable_2fa: {
		en: '{disable} {tfa}',
		fr: '{disable} la {tfa}'
	},
} as const satisfies Record<string, Expression>;

export { CodeLang, TRANSLATOR };
