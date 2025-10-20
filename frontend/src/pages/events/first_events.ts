import { addHandler } from "../events.js";
import { PageID, navigate } from "../page.js";

export function firstEvents(): void {
	addHandler(PageID.FIRST, "click", () => navigate(PageID.FIRST, PageID.API));
}
