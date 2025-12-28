import { setTheme } from "src/assets/themes/theme";
import { getUserInfos } from "src/services/user_management/user_state";
import { initPage } from "./routes/navigate";
import { Pages } from "./routes/navigate_types";

async function init(): Promise<void> {
	await getUserInfos();
	setTheme();
	initPage(Pages.WELCOME);
};

init();
