import { createButtonHtml } from "../../../components/button";

/** @todo print content front */
const SETTINGS_2FA = `
<div id='print-2fa-reply'></div>
`;

const SETTINGS_2FA_ENABLE = `
<div class='flex flex-row items-start'>
	<label class="mr-2 font-bold">2FA: </label>
	<div>
		your account is not protected
	</div>
	${createButtonHtml(['enable_2fa'], 'btn-enable-2fa', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` })}
	${SETTINGS_2FA}
</div>
`;

const SETTINGS_2FA_DISABLE = `
<div class='flex flex-row items-start'>
	<label class="mr-2 font-bold">2FA: </label>
	<div>
		your account is protected
	</div>
	${createButtonHtml(['disable_2fa'], 'btn-disable-2fa', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` })}
	${SETTINGS_2FA}
</div>
`;

export { SETTINGS_2FA_ENABLE, SETTINGS_2FA_DISABLE };
