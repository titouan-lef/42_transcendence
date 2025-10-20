// import { navigate } from "./pages/navigate.js";

// import { loadThemeSelector } from "./content/select_theme.js";
import { PageID } from "./page.js";
import { firstPageEvent } from "./events/first_events.js";
import { handleAPIEvent } from "./events/API_events.js";
import { handleTheme } from "./events/theme_events.js";

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
		case PageID.THEME: {
			handleTheme();
			break;
		}
		default: break;
	}
}
