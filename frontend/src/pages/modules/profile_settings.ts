import { printReplyInDiv, sendFile, sendPostRequestToBack } from "../../services/api_request";
import { getSafeElement } from "../../utils/getSafeElement";
import { updateAvatar } from "./box_aside";
import { setActiveBtn } from "./profile";

const SETTINGS = `
settings
<input type="file" id="change_avatar" accept="image/*">\
<p id="print-content"></p>
`;

function loadSettings(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = SETTINGS;
	setActiveBtn('btn-settings');

	const avatar = getSafeElement('profile-content', HTMLElement);
	avatar.addEventListener('change', (event) => {
	// eslint-disable-next-line
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file)
			uploadProfilePicture(file);
	});

	/** @todo events */
}

async function uploadProfilePicture(file: File): Promise<void> {
	const formData = new FormData();
	formData.append("picture", file);

	const reply = await sendFile(formData);
	printReplyInDiv(reply, "print-content");
	if (reply.status === 200)
		updateAvatar();
}

export { SETTINGS, loadSettings };
