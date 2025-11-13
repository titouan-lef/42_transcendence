import { addHandler } from "../../routes/event.js";
import { PageID, navigate } from "../../routes/page.js";
import { joinGame } from "../../services/user_management/join_game.js";

function apiEvents(): void {
	addHandler("btn-theme", "click", () => navigate(PageID.THEME));
	addHandler("btn-user", "click", () => navigate(PageID.USER));
	addHandler("btn-play", "click", () => joinGame());
}

export { apiEvents };
