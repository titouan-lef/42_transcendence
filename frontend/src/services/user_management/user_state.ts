import { Themes } from "../../assets/themes/themes.js";
import { isRequestSuccessfull, sendGetRequestToBack } from "../api_request.js";

let ws: WebSocket | null = null;

interface InfoList {
	username: string;
	nickname: string;
	email: string | null;
	is2FAEnabled: boolean;
	isAvatarSet: boolean;
	theme: Themes | null;
}

let currentUser: InfoList | null = null;

function getCurrentUserInfos(): InfoList | null {
	return currentUser;
}

function guestConnection(): void {
	currentUser = {
		username: 'guest',
		nickname: 'guest',
		email: null,
		is2FAEnabled: false,
		isAvatarSet: false,
		theme: null
	};
}

function isGuest(): boolean {
	return currentUser?.username === `guest`;
}

function isUserConnected(): boolean {
	if (currentUser === null)
		return false;
	if (isGuest())
		return false;
	return true;
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
		nickname: data.nickname,
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

export { InfoList, getCurrentUserInfos, getUserInfos, clearUserInfos, guestConnection, isGuest, isUserConnected };
