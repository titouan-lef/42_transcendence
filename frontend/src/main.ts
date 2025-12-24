import { setTheme } from "src/assets/themes/theme";
import { getUserInfos } from "src/services/user_management/user_state";
import { WELCOME, welcomeEvents } from "src/pages/welcome";
import { loadPage } from "src/routes/page";

async function init(): Promise<void> {
	await getUserInfos();
	setTheme();
	loadPage(WELCOME, welcomeEvents);
	// history.replaceState({ page: ELEM.innerHTML }, ""); // Clears statement to setup back and forward button
};

init();
