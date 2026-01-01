import { sendGetRequestToBack } from "../api_request";
import { clearUserInfos } from "./user_state";

async function disconnectUser(): Promise<void> {
	await sendGetRequestToBack("/api/user/logout");
}

async function onDisconnectEvent(): Promise<void> {
	await disconnectUser();
	clearUserInfos();
	document.dispatchEvent(new Event("user:logout"));
}

export { onDisconnectEvent };
