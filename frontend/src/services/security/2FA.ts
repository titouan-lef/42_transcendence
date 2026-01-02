import { getSafeElement } from "src/utils/getSafeElement";
import { SETTINGS_2FA_DISABLE, SETTINGS_2FA_ENABLE } from "../../pages/modules/profile/profile_settings_2fa";
import { isRequestSuccessfull, printReplyInDiv, ReplyFromBack, sendGetRequestToBack, sendPostRequestToBack } from "../api_request";
import { getCurrentUserInfos, getUserInfos } from "../user_management/user_state";
import { goBackToCurrentPage } from "src/routes/navigate";

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

async function sendSecureCode(): Promise<boolean> {
	const code = getSafeElement('password', HTMLInputElement).value;
	const container: HTMLElement = getSafeElement("print-content", HTMLElement);
	if (!code) {
		container.innerHTML = `<p>Please enter a 4 digit code.</p>`; /**@todo use translate tool */
		return false;
	}
	let reply: ReplyFromBack;
	const currentUser = getCurrentUserInfos();
	if (currentUser)
		reply = await sendPostRequestToBack("/api/user/secure", JSON.stringify({ user: currentUser.username, code: code }));
	else
		reply = await sendPostRequestToBack("/api/user/secure", JSON.stringify({ user: user, code: code }));

	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, "print-content");
		return false;
	}
	return true;
}

async function verify2FA(): Promise<void> {
	if(!await sendSecureCode())
		return;
	goBackToCurrentPage();
}

export { enable2FA, disable2FA, update2FAButton, verify2FA };
