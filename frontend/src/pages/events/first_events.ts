import { addHandler } from "../../routes/events.js";
import { PageID, navigate } from "../../routes/pages.js";

export function firstEvents(): void {
	addHandler(PageID.FIRST, "click", () => navigate(PageID.API));
}
