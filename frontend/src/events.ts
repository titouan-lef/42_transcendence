import { hello, test } from "./api_requests.js";
import { goTo } from "./navigate.js";

const EVENTS = new Map<string, () => void>([
	["first_page", (): void => goTo("test")],
	["btn-hello", hello],
	["btn-test", test]
]);

document.addEventListener("click", (event) => {
	const target = event.target;

	if (!target) {
		return ;
	} else if (target instanceof HTMLElement) {
		EVENTS.get(target.id)?.();
	} else {
		console.log("problem with HTMLElement");
	}
});

window.addEventListener("popstate", (event) => {
	const page = (event.state?.page) || "init";
	goTo(page);
});
