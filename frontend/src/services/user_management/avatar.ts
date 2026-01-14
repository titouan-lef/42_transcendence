import { getSafeElement } from "../../utils/getSafeElement";
import { isRequestSuccessfull, printReplyInDiv, sendFile } from "../api_request";
import { getCurrentUserInfos, getUserInfos } from "./user_state";

async function uploadProfilePicture(file: File): Promise<void> {
	const formData = new FormData();
	formData.append("picture", file);

	const reply = await sendFile(formData);
	printReplyInDiv(reply, "print-avatar-reply");
	if (!isRequestSuccessfull(reply))
		return;
	await getUserInfos();
	updateAvatar();
}

async function updateAvatar(): Promise<void> {
	const avatar = getSafeElement("avatar-img", HTMLImageElement);
	if (!avatar)
		return;

	const currentUser = getCurrentUserInfos();
	if (!currentUser?.isAvatarSet)
		avatar.src = "./images/avatar.png";
	else
		avatar.src = `/pictures/${currentUser.username}?t=${Date.now()}`;
}

export { uploadProfilePicture, updateAvatar };
