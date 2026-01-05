import { Themes, THEMES_LIST } from "./themes";
import { sendPostRequestToBack } from "../../services/api_request";
import { getCurrentUserInfos, isUserConnected } from "../../services/user_management/user_state";
import { ThemeBody } from "#shared/HTTP.js";

function randomTheme(): void {
	const randomIndex = Math.floor(Math.random() * THEMES_LIST.length);
	document.body.dataset.theme = THEMES_LIST[randomIndex];
}

function setTheme(): void {
	const currentUser = getCurrentUserInfos();
	if (currentUser?.theme)
		document.body.dataset.theme = currentUser.theme;
	else
		randomTheme();
}

function updateTheme(theme: Themes): void {
	const currentUser = getCurrentUserInfos();
	if (!currentUser)
		return;
	if (isUserConnected()) {
		const body: ThemeBody = { theme: theme };
		sendPostRequestToBack("/api/user/change_theme", JSON.stringify(body));
	}
	currentUser.theme = theme;
	setTheme();
}

export { setTheme, updateTheme };
