import { Navigation } from "./navigate_types";

class NavigateEvent extends Event {
	public readonly nav: Navigation;

	constructor(nav: Navigation) {
		super("navigate");
		this.nav = nav;
	}
}

function navigateTo(nav: Navigation): void {
	const event = new NavigateEvent(nav);
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
