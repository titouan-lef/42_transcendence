import { setTheme } from "src/assets/themes/theme";
import { getUserInfos } from "src/services/user_management/user_state";
import { WELCOME } from "src/pages/welcome";
import { loadModularPage } from "src/pages/modular";
import { loadPage } from "src/routes/page";

async function init(): Promise<void> {
	await getUserInfos();
	setTheme();
	loadPage(WELCOME, loadModularPage);
	// history.replaceState({ page: ELEM.innerHTML }, ""); // Clears statement to setup back and forward button
};

init();
