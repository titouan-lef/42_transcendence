import { getSafeElement } from "../../utils/getSafeElement";
import { getReplyMessage, isRequestSuccessfull, printReplyInDiv, sendFile, sendPostRequestToBack } from "../api_request";
import { currentUser } from "./login";

async function uploadProfilePicture(file: File): Promise<void> {
	const formData = new FormData();
	formData.append("picture", file);

	const reply = await sendFile(formData);
	printReplyInDiv(reply, "print-avatar-reply");
	if (reply.status === 200)
		updateAvatar();
}

async function updateAvatar(): Promise<void> {
	const avatar = getSafeElement("avatar-img", HTMLImageElement);

	if (!currentUser) {
		avatar.src = "./images/avatar.png";
		return;
	}
	const reply = await sendPostRequestToBack("/api/user/picture", JSON.stringify({ user: currentUser.username }));

	if (isRequestSuccessfull(reply)) {
		const path = await getReplyMessage(reply);
		avatar.src = `/pictures/${path}?t=${Date.now()}`;
	}
}

export { uploadProfilePicture, updateAvatar };
