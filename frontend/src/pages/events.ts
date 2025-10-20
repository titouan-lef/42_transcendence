// import { navigate } from "./pages/navigate.js";
import { setTheme, Themes } from "../theme.js";
// import { loadThemeSelector } from "./content/select_theme.js";
import { PageID } from "./pages.js";
import { firstPageEvent } from "./events/first_events.js";
import { handleAPIEvent } from "./events/API_events.js";

const THEME_EVENTS = new Map<string, () => void>([
	// ["btn-hello", hello],
	// ["btn-test", test],
]);

Object.values(Themes).forEach(element => {
	THEME_EVENTS.set("btn-" + element, (): void => setTheme(element));
});

document.addEventListener("click", (event) => {
	const target = event.target;

	if (!target) {
		return ;
	} else if (target instanceof HTMLElement) {
		THEME_EVENTS.get(target.id)?.();
	} else {
		console.log("problem with HTMLElement");
	}
});

export function loadEvent(id: PageID): void {
	switch (id) {
		case PageID.FIRST: {
			firstPageEvent();
			break;
		}
		case PageID.API: {
			handleAPIEvent();
			break;
		}
		default: break;
	}
}
