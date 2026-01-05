import { Pages } from "src/routes/navigate_types";
import { navigateTo } from "../../routes/navigate";
import { sendGetRequestToBack } from "../api_request";
import { clearUserInfos } from "./user_state";

async function onDisconnectEvent(): Promise<void> {
	await sendGetRequestToBack("/api/user/logout");
	clearUserInfos();
	navigateTo(Pages.HOME);
}

export { onDisconnectEvent };
