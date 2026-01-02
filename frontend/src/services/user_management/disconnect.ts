import { sendGetRequestToBack } from "../api_request";
import { clearUserInfos } from "./user_state";

async function onDisconnectEvent(): Promise<void> {
	await sendGetRequestToBack("/api/user/logout");
	clearUserInfos();
	document.dispatchEvent(new Event("user:logout"));
}

export { onDisconnectEvent };
