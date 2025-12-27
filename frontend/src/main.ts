import { setTheme } from "src/assets/themes/theme";
import { getUserInfos } from "src/services/user_management/user_state";
import { initPage } from "./routes/navigate";
import { PAGES } from "./routes/navigate_types";

async function init(): Promise<void> {
	await getUserInfos();
	setTheme();
	initPage(PAGES.WELCOME);
	// history.replaceState({ page: ELEM.innerHTML }, ""); // Clears statement to setup back and forward button
};

init();
