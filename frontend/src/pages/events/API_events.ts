import { addHandler } from "../../routes/events.js";
import { PageID, navigate } from "../../routes/pages.js";

function apiEvents(): void {
	addHandler("btn-theme", "click", () => navigate(PageID.THEME));
	addHandler("btn-user", "click", () => navigate(PageID.USER));
}

export { apiEvents };
