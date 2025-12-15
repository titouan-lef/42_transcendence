import { createButtonHtml } from "../../../components/button";
import { disable2FA, enable2FA } from "../../../services/security/2FA";
import { currentUser, getUserInfos } from "../../../services/user_management/login";
import { getSafeElement } from "../../../utils/getSafeElement";

const SETTINGS_2FA = `
<div id='print-2fa-reply'></div>
`;

const SETTINGS_2FA_ENABLE = `
<div>
	your account is not protected
</div>
${createButtonHtml(['enable_2fa'], 'btn-enable-2fa', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` })}
${SETTINGS_2FA}
`;

const SETTINGS_2FA_DISABLE = `
<div>
	your account is protected
</div>
${createButtonHtml(['disable_2fa'], 'btn-disable-2fa', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` })}
${SETTINGS_2FA}
`;

async function update2FAButton(): Promise<void> {
	if (!currentUser)
		return;

	await getUserInfos();

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

export { update2FAButton };
