import { printReplyInDiv, sendFile, sendGetRequestToBack, sendPostRequestToBack } from "../../services/api_request";
import { getSafeElement } from "../../utils/getSafeElement";
import { updateAvatar } from "./box_aside";
import { DIALOG_SEPARATOR_STYLE } from "./dialog_style";
import { setActiveBtn } from "./profile";

/** @todo real front with selector to enable / disable 2FA */
/** @todo ask for email only if 2FA is enable */
const SETTINGS = `
<p> settings </p>
<hr class="${DIALOG_SEPARATOR_STYLE}">
<input type="text" id="UserEmail" >
<input id="btn-2FA" type="button" value="Activate 2FA"/>
<hr class="${DIALOG_SEPARATOR_STYLE}">
<input type="file" id="change_avatar" accept="image/*">\
<hr class="${DIALOG_SEPARATOR_STYLE}">
<p id="print-content"></p>
`;

function loadSettings(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = SETTINGS;
	setActiveBtn('btn-settings');

	const avatar = getSafeElement('change_avatar', HTMLElement);
	avatar.addEventListener('change', (event) => {
		if (event.target instanceof HTMLInputElement) {
			const file = event.target.files?.[0];
			if (file)
				uploadProfilePicture(file);
		}
	});

	const activate = getSafeElement('btn-2FA', HTMLElement);
	activate.addEventListener('click', activate2FA);

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

async function activate2FA(): Promise<void> {
	const container = getSafeElement('profile-content', HTMLElement);
	const email = getSafeElement("UserEmail", HTMLInputElement).value;
	if (!email) {
		container.innerHTML = "Enter you email"; /** @todo use translate tool*/
		return;
	}

	/** @todo change the email in the update user menu */
	const reply1 = await sendPostRequestToBack("/api/user/email", JSON.stringify({ email: email }));
	printReplyInDiv(reply1, "print-content");

	const reply2 = await sendGetRequestToBack("/api/user/activate-secure");
	printReplyInDiv(reply2, "print-content");

}

export { SETTINGS, loadSettings };
