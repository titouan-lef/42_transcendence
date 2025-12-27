enum PAGES {
	WELCOME ,
	HOME,
	LEADERBOARD
};

const SEPARATOR = 100;

enum MODALS {
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
	GAME_SELECTION
};

type NAVIGATION = PAGES | MODALS;

function isModal(nav: NAVIGATION): nav is MODALS {
	return nav >= SEPARATOR;
}

function isPage(nav: NAVIGATION): nav is PAGES {
	return nav < SEPARATOR;
}

export { PAGES, MODALS, NAVIGATION, isPage, isModal };
