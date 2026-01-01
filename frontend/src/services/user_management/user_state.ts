import { Themes } from "../../assets/themes/themes.js";
import { isRequestSuccessfull, sendGetRequestToBack } from "../api_request.js";

let ws: WebSocket | null = null;

interface InfoList {
	username: string;
	pseudo: string;
	email: string | null;
	is2FAEnabled: boolean;
	isAvatarSet: boolean;
	theme: Themes | null
}

let currentUser: InfoList | null = null;

function getCurrentUserInfos(): InfoList | null {
	return currentUser;
}

async function getUserInfos(): Promise<void> {
	const reply = await sendGetRequestToBack("/api/user/get_user");
	if (!isRequestSuccessfull(reply))
		return;
	if (!ws)
		ws = new WebSocket(`ws/online`);
	const data: InfoList = JSON.parse(reply.content); /** @todo verify if try/ctach needed */
	currentUser = {
		username: data.username,
		pseudo: data.pseudo,
		email: data.email,
		is2FAEnabled: data.is2FAEnabled,
		isAvatarSet: data.isAvatarSet,
		theme: data.theme
	};
}

function clearUserInfos(): void {
	ws?.close(1000, "User logged out");
	ws = null;
	currentUser = null;
}

export { getCurrentUserInfos, getUserInfos, clearUserInfos };
