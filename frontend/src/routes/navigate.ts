import { Navigation } from "./navigate_types";

class NavigateEvent extends Event {
	public readonly nav: Navigation;
	public readonly user?: string;

	constructor(nav: Navigation, user?: string) {
		super("navigate");
		this.nav = nav;
		this.user = user;
	}
}

function navigateTo(nav: Navigation, user?: string): void {
	const event = new NavigateEvent(nav, user);
	document.dispatchEvent(event);
}

function goBack(): void {
	history.back();
}

function goBackToCurrentPage(): void {
	document.dispatchEvent(new Event('currentPage'));
}

function goBackToHomeAfterLogOut(): void {
	document.dispatchEvent(new Event('logout'));
}

export { NavigateEvent, navigateTo, goBack, goBackToCurrentPage, goBackToHomeAfterLogOut };
