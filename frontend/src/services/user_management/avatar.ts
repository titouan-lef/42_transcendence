import { getSafeElement } from "../../utils/getSafeElement";
import { getReplyMessage, printReplyInDiv, sendFile, sendPostRequestToBack } from "../api_request";
import { currentUser, getUserInfos } from "./login";

async function uploadProfilePicture(file: File): Promise<void> {
	const formData = new FormData();
	formData.append("picture", file);

	const reply = await sendFile(formData);
	printReplyInDiv(reply, "print-avatar-reply");
	if (reply.status !== 200)
		return;
	await getUserInfos();
	updateAvatar();

}

async function updateAvatar(): Promise<void> {
	const avatar = getSafeElement("avatar-img", HTMLImageElement);

	if (!currentUser?.isAvatarSet)
		avatar.src = "./images/avatar.png";
	else
		avatar.src = `/pictures/${currentUser.username}?t=${Date.now()}`;
}

export { uploadProfilePicture, updateAvatar };
