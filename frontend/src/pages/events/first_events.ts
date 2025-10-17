import { PAGE_ID, navigate } from "../pages.js";

export function firstPageEvent(): void {
	document.addEventListener("click", (event) => {
		const target = event.target;

		if (target instanceof HTMLElement) {
			navigate(PAGE_ID.FIRST, PAGE_ID.API);
		}
	});
}
