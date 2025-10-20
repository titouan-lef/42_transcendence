import { PageID } from "./pages.js";
import { firstEvents } from "../pages/events/first_events.js";
import { apiEvents } from "../pages/events/API_events.js";
import { themeEvents } from "../pages/events/theme_events.js";

interface Handler{
	elem: HTMLElement;
	type: string;
	func: EventListener;
}

/**
 * stores all handlers in an array.
 */
let activeHandlers: Handler[] = [];

/**
 * adds a handler to Handler array
 * @param id PageID of the page you want to add an handler
 * @param type event type (i.e.: "click")
 * @param func listener function
 */
export function addHandler(id: string, type: string, func: EventListener): void {
	const elem = document.getElementById(id);

	if (!(elem instanceof HTMLElement)) {
		throw new Error("cannot find id " + id);
	}
	elem.addEventListener(type, func);
	activeHandlers.push({elem, type, func});
}

/**
 * clear the Handler array, so we can avoid listener functions added and never removed (leaks)
 */
function clearHandlers(): void {
	activeHandlers.forEach((handler) => {
		handler.elem.removeEventListener(handler.type, handler.func);
	});
	activeHandlers = [];
}

/**
 * lauches event depending on the PageID
 */
export function loadEvent(id: PageID): void {
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
		default: {
			console.log("id not found");
			break;
		}
	}
}
