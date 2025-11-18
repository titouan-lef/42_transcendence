import { PageID } from "./page.js";
import { firstEvents } from "../pages/event/first_events.js";
import { apiEvents } from "../pages/event/api_events.js";
import { themeEvents } from "../pages/event/theme_events.js";
import { getSafeElement } from "../utils/getSafeElement.js";
import { userEvents } from "../pages/event/user_events.js";
import { whoami } from "../services/user_management/login.js";
import { mainMenuEvents } from "../pages/main_menu.js";

interface Handler {
	id	: string;
	elem: HTMLElement;
	type: keyof GlobalEventHandlersEventMap;
	func: EventListener;
}

let activeHandlers: Handler[] = [];

/**
 * adds a handler to Handler array
 * @param id PageID of the page you want to add an handler
 * @param type event type (i.e.: "click")
 * @param func listener function
 */
function addHandler(id: string, type: keyof GlobalEventHandlersEventMap, func: EventListener): void {
	const elem = getSafeElement(id, HTMLElement);

	elem.addEventListener(type, func);
	activeHandlers.push({ id, elem, type, func });
}

function deleteHandlerByID(id: string): void {
	let i = 0;
	while (i < activeHandlers.length) {
		if (activeHandlers[i].id === id) {
			activeHandlers[i].elem.removeEventListener(activeHandlers[i].type, activeHandlers[i].func);
			activeHandlers.splice(i, 1);
			continue;
		}
		i++;
	}
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
			whoami();
			break;
		}
		case PageID.MAIN_MENU: {
			mainMenuEvents();
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

export { addHandler, loadEvent, deleteHandlerByID, clearHandlers };
