import { PageID, navigate } from "../page.js";

export function firstPageEvent(): void {
	document.addEventListener("click", (event) => {
		const target = event.target;

		if (target instanceof HTMLElement) {
			navigate(PageID.FIRST, PageID.API);
		}
	});
}
