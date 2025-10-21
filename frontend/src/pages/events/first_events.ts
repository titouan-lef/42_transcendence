import { addHandler } from "../../routes/events.js";
import { PageID, navigate } from "../../routes/pages.js";

function firstEvents(): void {
	addHandler(PageID.FIRST, "click", () => navigate(PageID.API));
}

export { firstEvents };
