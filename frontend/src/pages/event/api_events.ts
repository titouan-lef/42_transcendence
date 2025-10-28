import { addHandler } from "../../routes/event.js";
import { PageID, navigate } from "../../routes/page.js";

function apiEvents(): void {
	addHandler("btn-theme", "click", () => navigate(PageID.THEME));
	addHandler("btn-user", "click", () => navigate(PageID.USER));
}

export { apiEvents };
