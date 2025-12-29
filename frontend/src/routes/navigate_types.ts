enum GameTypes {
	LOCAL = "local",
	AI = "solo",
	RANKED = "ranked"
}

enum Pages {
	WELCOME,
	HOME,
	LEADERBOARD,
	PROFILE,
	GAME,
};

const MODAL_SEPARATOR = 100;

enum Modals {
	SIGN_UP = 100, // enum member initializers must be compile-time constants, but must the same value as SEPARATOR.
	SIGN_IN,
	TWO_FA,
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

function isHistorySavedModal(nav: Navigation): nav is Modals {
	return nav === Modals.GAME_SELECTION || nav === Modals.GAME_OPTIONS;
}

function isGameModal(nav: Navigation): nav is GameModals {
	return nav >= GAME_MODAL_SEPARATOR;
}

export { GameTypes, Pages, Modals, GameModals, Navigation, isPage, isModal, isGameModal, isHistorySavedModal };
