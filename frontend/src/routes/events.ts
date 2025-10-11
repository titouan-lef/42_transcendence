import { PageID } from "./pages.js";
import { firstEvents } from "../pages/events/first_events.js";
import { apiEvents } from "../pages/events/API_events.js";
import { themeEvents } from "../pages/events/theme_events.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { userEvents } from "../pages/events/User_events.js";

interface Handler{
	elem: HTMLElement;
	type: string;
	func: EventListener;
}

let activeHandlers: Handler[] = [];

/**
 * adds a handler to Handler array
 * @param id PageID of the page you want to add an handler
 * @param type event type (i.e.: "click")
 * @param func listener function
 */
function addHandler(id: string, type: string, func: EventListener): void {
	const elem = getSafeElement(id);

	elem.addEventListener(type, func);
	activeHandlers.push({elem, type, func});
}

function loadEvent(id: PageID): void {
	clearHandlers();

	switch (id) {
		case PageID.FIRST: {
			firstEvents();
			break;
		}
		case PageID.API: {
			apiEvents();
			break;
		}
		case PageID.THEME: {
			themeEvents();
			break;
		}
		case PageID.USER: {
			userEvents();
			break;
		}
		default: {
			console.log("id not found");
			break;
		}
	}
}

function clearHandlers(): void {
	activeHandlers.forEach((handler) => {
		handler.elem.removeEventListener(handler.type, handler.func);
	});
	activeHandlers = [];
}

export { addHandler, loadEvent };
