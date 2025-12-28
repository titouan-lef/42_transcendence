enum GameTypes {
	LOCAL = "local",
	AI = "solo",
	RANKED = "ranked"
}

enum Pages {
	WELCOME,
	HOME,
	LEADERBOARD,
	GAME,
};

const SEPARATOR = 100;

enum Modals {
	WELCOME = 100, // enum member initializers must be compile-time constants, but must the same value as SEPARATOR.
	HOME,
	SIGN_UP,
	SIGN_IN,
	LOG_IN,
	TWO_FA,
	PROFILE,
	PROFILE_DASHBOARD,
	PROFILE_HISTORY,
	PROFILE_SETTINGS,
	EMAIL_CONF,
	GAME_SELECTION,
	GAME_OPTIONS,
	ADD_FRIEND
};

type Navigation = Pages | Modals;

function isModal(nav: Navigation): nav is Modals {
	return nav >= SEPARATOR;
}

function isPage(nav: Navigation): nav is Pages {
	return nav < SEPARATOR;
}

export { GameTypes, Pages, Modals, Navigation, isPage, isModal };
