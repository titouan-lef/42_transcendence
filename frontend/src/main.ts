import { setTheme } from "./assets/themes/theme";
import { getUserInfos } from "./services/user_management/user_state";
import { initPage } from "./routes/navigation";
import { Pages } from "./routes/navigate_types";

async function init(): Promise<void> {
	await getUserInfos();
	setTheme();
	initPage(Pages.WELCOME);
};

init();
