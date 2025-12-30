enum GameTypes {
	LOCAL = "local",
	AI = "solo",
	RANKED = "ranked"
}

enum Pages {
	WELCOME,
	HOME,
	LEADERBOARD,
	DASHBOARD,
	PROFILE,
	GAME_SELECTION,
	GAME_OPTIONS,
	GAME
}

const SEPARATOR = 100;

enum Modals {
	SIGN_UP = 100,
	SIGN_IN,
	TWO_FA,
	EMAIL_CONF,
	ADD_FRIEND,
	WAITING,
	GAME_QUIT
}

const PAGES_MODALS: Record<Pages, readonly Modals[]> = {
	[Pages.WELCOME]: [],
	[Pages.HOME]: [Modals.SIGN_UP, Modals.SIGN_IN, Modals.TWO_FA, Modals.ADD_FRIEND],
	[Pages.LEADERBOARD]: [Modals.ADD_FRIEND],
	[Pages.DASHBOARD]: [Modals.ADD_FRIEND],
	[Pages.PROFILE]: [Modals.ADD_FRIEND, Modals.EMAIL_CONF],
	[Pages.GAME_SELECTION]: [],
	[Pages.GAME_OPTIONS]: [],
	[Pages.GAME]: [Modals.WAITING, Modals.GAME_QUIT],
};

type Navigation = Pages | Modals;

function isPage(nav: Navigation): nav is Pages {
	return nav < SEPARATOR;
}

function isModularPage(nav: Navigation): nav is Pages {
	return nav >= Pages.HOME && nav <= Pages.DASHBOARD;
}

function isModal(nav: Navigation): nav is Modals {
	return nav >= SEPARATOR;
}

const ALL_PAGES: Pages[] = Object.keys(Pages)
	.map(Number)
	.filter(n => !Number.isNaN(n));

function isAssociatedPage(modal: Modals, page: Pages): boolean {
	return PAGES_MODALS[page].includes(modal);
}

function getAssociatedPage(modal: Modals): Pages {
	for (const page of ALL_PAGES) {
		if (PAGES_MODALS[page].includes(modal))
			return page;
	}
	throw new Error(`Modal ${modal} has no page`);
}

function needToBeConnected(nav: Navigation): boolean {
	if (isPage(nav))
		return false;
	if (isModal(nav) && nav >= Modals.EMAIL_CONF)
		return true;
	return false;
}

export { GameTypes, Pages, Modals, Navigation, isPage, isModularPage, isModal, needToBeConnected, isAssociatedPage, getAssociatedPage };
