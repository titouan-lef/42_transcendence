import { sendGetRequestToBack } from "../api_request";

async function disconnectUser(): Promise<void> {
	await sendGetRequestToBack("/api/user/logout");
}

export { disconnectUser };
