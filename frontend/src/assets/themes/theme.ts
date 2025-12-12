import { Themes, THEMES_LIST } from "./themes";
import { sendPostRequestToBack } from "../../services/api_request";
import { currentUser } from "../../services/user_management/login";

function randomTheme(): void {
	const randomIndex = Math.floor(Math.random() * THEMES_LIST.length);
	document.body.dataset.theme = THEMES_LIST[randomIndex];
}

function setTheme(): void {
	if (currentUser?.theme)
		document.body.dataset.theme = currentUser.theme;
	else
		randomTheme();
}

function updateTheme(theme: Themes): void {
	if (!currentUser)
		return;
	sendPostRequestToBack("/api/user/change_theme", JSON.stringify({ theme: theme }));
	currentUser.theme = theme;
	setTheme();
}

export { Themes, setTheme, updateTheme };
