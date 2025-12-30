import { getSafeElement } from "src/utils/getSafeElement";
import { SETTINGS_2FA_DISABLE, SETTINGS_2FA_ENABLE } from "../../pages/modules/profile/profile_settings_2fa";
import { isRequestSuccessfull, printReplyInDiv, sendGetRequestToBack } from "../api_request";
import { getCurrentUserInfos, getUserInfos } from "../user_management/user_state";

async function enable2FA(): Promise<void> {
	const reply = await sendGetRequestToBack("/api/user/enable-secure");
	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, "print-2fa-reply");
		return;
	}
	await getUserInfos();
	update2FAButton();
}

async function disable2FA(): Promise<void> {
	const reply = await sendGetRequestToBack("/api/user/disable-secure");
	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, "print-2fa-reply");
		return;
	}
	await getUserInfos();
	update2FAButton();
}

async function update2FAButton(): Promise<void> {
	const currentUser = getCurrentUserInfos();
	if (!currentUser)
		return;

	const switch2fa = getSafeElement('switch-2fa', HTMLElement);
	switch2fa.innerHTML = (currentUser.is2FAEnabled) ? SETTINGS_2FA_DISABLE : SETTINGS_2FA_ENABLE;
	twoFactorAuthEvents();
}

function twoFactorAuthEvents(): void {
	const s2fa = getSafeElement('switch-2fa', HTMLElement);

	s2fa.querySelectorAll('*[id]').forEach(elem => {
		switch (elem.id) {
			case 'btn-enable-2fa':
				elem.addEventListener('click', enable2FA);
				break;
			case 'btn-disable-2fa':
				elem.addEventListener('click', disable2FA);
				break;
			default:
				break;
		}
	});
}

export { enable2FA, disable2FA, update2FAButton };
