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

const MODAL_SEPARATOR = 100;

enum Modals {
	SIGN_UP = 100, // enum member initializers must be compile-time constants, but must the same value as SEPARATOR.
	SIGN_IN,
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

const GAME_MODAL_SEPARATOR = 200;

enum GameModals {
	WAITING = 200,
	GAME_QUIT
}

type Navigation = Pages | Modals | GameModals;

function isPage(nav: Navigation): nav is Pages {
	return nav < MODAL_SEPARATOR;
}

function isModal(nav: Navigation): nav is Modals {
	return nav >= MODAL_SEPARATOR && nav < GAME_MODAL_SEPARATOR;
}

function isGameModal(nav: Navigation): nav is GameModals {
	return nav >= GAME_MODAL_SEPARATOR;
}

export { GameTypes, Pages, Modals, GameModals, Navigation, isPage, isModal, isGameModal };
