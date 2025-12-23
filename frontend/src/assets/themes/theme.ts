import { Themes, THEMES_LIST } from "./themes";
import { sendPostRequestToBack } from "../../services/api_request";
import { getCurrentUserInfos } from "src/services/user_management/user_state";

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
	sendPostRequestToBack("/api/user/change_theme", JSON.stringify({ theme: theme }));
	currentUser.theme = theme;
	setTheme();
}

export { setTheme, updateTheme };
