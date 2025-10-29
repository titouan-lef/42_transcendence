import { addHandler } from "../../routes/event.js";
import { PageID, navigate } from "../../routes/page.js";

function firstEvents(): void {
	addHandler(PageID.FIRST, "click", () => navigate(PageID.MAIN_MENU));
}

export { firstEvents };
