type CodeLang = 'fr' | 'en';

type Expression = Record<CodeLang, string>;

// 'as const' allows you to make fields read-only and avoid adding/removing fields.
// 'satisfies ...' allows you to detect errors if a field doesn't exist (or is badly written).
/** @todo revoir toutes les traduction lors d'une future PR langues car plein d'erreurs */
const TRANSLATOR = {
	// VERBS
	play: { en: "play", fr: "jouer" },
	change: { en: "change", fr: "changer" },
	confirm: { en: "confirm", fr: "confirmer" },
	add: { en: "add", fr: "ajouter" },
	remove: { en: "remove", fr: "supprimer" },
	invite: { en: "invite", fr: "inviter" },
	delete: { en: "delete", fr: "supprimer" },
	continue: { en: "continue", fr: "continuer" },
	go_back: { en: "go back", fr: "revenir" },
	log_in: { en: "log in", fr: "se connecter" },
	log_out: { en: "log out", fr: "se déconnecter" },
	enable: { en: "enable", fr: "activer" },
	disable: { en: 'disable', fr: 'désactiver' },
	save: { en: "save", fr: "enregistrer" },
	edit: { en: "edit", fr: "modifier" },
	cancel: { en: "cancel", fr: "annuler" },
	update: { en: "update", fr: "mettre à jour" },
	verify: { en: "verify", fr: "verifier" },
	
	// NOUNS
	user: { en: "user", fr: "utilisateur" },
	user_name: { en: "username", fr: "nom d'utilisateur" },
	nickname: { en: "nickname", fr: "pseudo" },
	elo: { en: "elo", fr: "elo" },
	password: { en: "password", fr: "mot de passe" },
	email: { en: "email", fr: "email" },
	friend: { en: "friend", fr: "ami" },
	game: { en: "game", fr: "jeu" },
	code: { en: "code", fr: "code" },
	twofa: { en: "2FA", fr: "2FA" },
	map: { en: "map", fr: "map" },
	ball: { en: "ball", fr: "balle" },
	nothing: { en: "nothing", fr: "rien" },
	leaderboard: { en: "leaderboard", fr: "classement" },

	// STATES | ADJECTIVES
	logged_in: { en: "logged in", fr: "connecté" },
	logged_out: { en: "logged out", fr: "déconnecté" },
	wrong: { en: "wrong", fr: "incorrect" },
	invalid: { en: "invalid", fr: "invalide" },
	already: { en: "already", fr: "déjà" },
	taken: { en: "taken", fr: "utilisé" },
	enabled: { en: "enabled", fr: "activé" },
	disabled: { en: "disabled", fr: "désactivé" },
	required: { en: "required", fr: "requis" },
	not: { en: "not", fr: "non" },
	found: { en: "found", fr: "trouvé" },
	added: { en: "added", fr: "ajouté" },
	removed: { en: "removed", fr: "supprimé" },
	updated: { en: "updated", fr: "mis à jour" },
	created: { en: "created", fr: "créé" },
	prefered: { en: "prefered", fr: "favorite" },

	// USERS | CONNECTION
	wrong_creadentials: {
		en: "{wrong} {user_name} or {password}",
		fr: "{user_name} ou {password} {wrong}",
	},
	twofa_required: {
		en: "{twofa} {required}",
		fr: "{twofa} {required}",
	},
	not_connected: {
		en: "You are {not} {logged_in}",
		fr: "Vous n'êtes {not} {logged_in}"
	},
	no_such_user: {
		en: "No such {user}",
		fr: "Aucun {user} de ce nom",
	},
	invalid_username: {
		en: "{invalid} {user_name}",
		fr: "{user_name} {invalid}",
	},
	username_taken: {
		en: "{user_name} {already} {taken}",
		fr: "{user_name} {already} {taken}",
	},
	friend_added: {
		en: "{friend} {added}",
		fr: "{friend} {added}",
	},
	friend_removed: {
		en: "{friend} {removed}",
		fr: "{friend} {removed}",
	},
	invalid_2fa_code: {
		en: "{invalid} {twofa} {code}",
		fr: "{code} de {twofa} {invalid}",
	},
	email_required: {
		en: "{email} {required} to {enable} {twofa}",
		fr: "{email} {required} pour {enable} la {twofa}",
	},
	friend_himself: {
		en: "You cannot {add} yousefl as a {friend}",
		fr: "Vous ne pouvez pas vous {add} en {friend}",
	},
	already_friend_with: {
		en: "This {user} is {already} your {friend}",
		fr: "Cet {user}, est {already} votre {friend}",
	},

	// FRONT | NAVIGATION
	settings: { en: "settings", fr: "paramètres" },
	profile: { en: "profile", fr: "profil" },
	history: { en: "history", fr: "historique" },
	summary: { en: "summary", fr: "résumé" },
	dashboard: { en: "dashboard", fr: "tableau de bord" },
	see_more: { en: "see more", fr: "voir plus" },
	sign_in: { en: "sign in", fr: "se connecter" },
	sign_up: { en: "sign up", fr: "s'inscrire" },
	continue_as_guest: {
		en: "{continue} as guest",
		fr: "{continue} en tant qu'invité",
	},
	change_password: {
		en: "{change} {password}",
		fr: "{change} de {password}",
	},
	confirm_password: {
		en: "{confirm} {password}",
		fr: "{confirm} le {password}",
	},
	add_friend: {
		en: "{add} {friend}",
		fr: "{add} un {friend}",
	},
	prefered_map: { en: "{prefered} {map}", fr: "{prefered} {map}" },
	prefered_ball: { en: "{prefered} {ball}", fr: "{prefered} {ball}" },
	last_games: { en: "last games", fr: "dernières parties" },
	wins: { en: "wins", fr: "victoires" },
	loses: { en: "loses", fr: "défaites" },
	win_rate: { en: "win rate", fr: "ratio de victoires" },
	chart: { en: "chart", fr: "tableau" },
	graph: { en: "graph", fr: "graphique" },
	win_rate_chart: { en: "{win_rate} {graph}", fr: "{graph} du {win_rate}" },
	games_played: { en: "games played", fr: "parties jouées" },
	goals_avg: { en: "goals average", fr: "moyenne des buts" },
	games_time: { en: "games time", fr: "temps des parties" },
	elo_chart: { en: "{elo} {graph}", fr: "{graph} du {elo}" },
	diff_goals_chart: {
		en: "goals difference {graph}",
		fr: "{graph} de la différence des buts"
	},
	all: { en: "all", fr: "tout" },
	season: { en: "season", fr: "saison" },
	tfa_mail: { en: "{twofa} e-mail", fr: "courriel de la {twofa}" },
	new_password: { en: "new password", fr: "nouveau mot de passe" },
	user_informations: { en: "user informations", fr: "informations" },
	change_avatar: { en: "change avatar", fr: "modifier avatar" },
	options: { en: "options", fr: "paramètres" },
	enable_2fa: { en: '{enable} {twofa}', fr: '{enable} la {twofa}' },
	disable_2fa: { en: '{disable} {twofa}', fr: '{disable} la {twofa}' },
	nothing_updated: {
		en: "{nothing} to {update}",
		fr: "{nothing} a {update}"
	},
	refify_email: {
		en: "{verify} your {email}",
		fr: "{verify} votre {email}"
	},
	invalid_email: {
		en: "{invalid} {email}",
		fr: "{email} {invalid}"
	},
	please_disable_2FA: {
		en : "Please desactivate {twofa} before clearing your {email}",
		fr : "Desactivatez la {twofa} avant d'effacer votre {email}"
	}
} as const satisfies Record<string, Expression>;

export { CodeLang, TRANSLATOR };
