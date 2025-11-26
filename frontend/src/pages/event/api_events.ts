import { addHandler } from "../../routes/event.js";
import { PageID, navigate } from "../../routes/page.js";
import { newGameVsAI, newLocalGame, newRankedGame } from "../../services/api_request.js";

function apiEvents(): void {
	addHandler("btn-theme", "click", () => navigate(PageID.THEME));
	addHandler("btn-user", "click", () => navigate(PageID.USER));
	addHandler("btn-play-ranked", "click", () => newRankedGame());
	addHandler("btn-play-local", "click", () => newLocalGame());
	addHandler("btn-play-AI", "click", () => newGameVsAI());
}

export { apiEvents };
