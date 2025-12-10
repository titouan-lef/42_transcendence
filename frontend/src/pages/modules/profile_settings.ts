import { printReplyInDiv, sendFile, sendGetRequestToBack } from "../../services/api_request";
import { createButtonHtml } from "../../components/button";
import { createInputHtml } from "../../components/input";
import { updateUser } from "../../services/user_management/update_user";
import { getSafeElement } from "../../utils/getSafeElement";
import { updateAvatar } from "./box_aside";
import { setTheme, Themes } from "../../assets/themes/theme.js";
import { createParagraphHtml } from "../../components/paragraph";
import { setActiveBtn } from "./profile_navbar";

/** @todo get database informations */
interface UserInfos {
	nickname: string,
	twofactor_auth: boolean,
	tfa_mail: string,
	avatar: string,
}

const CURRENT_USER: UserInfos = {
	nickname: 'roger_du_12',
	twofactor_auth: true,
	tfa_mail: 'roger1212@mail.it',
	avatar: './images/avatar.png'
};

const BTN_SAVE = `
<div class='flex flex-row gap-4'>
	${createButtonHtml(['cancel'], 'btn-cancel', { 'class': `bg-dark text-warning p-1 rounded-2xl font-bold` })}
	${createButtonHtml(['save'], 'btn-save', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` })}
</div>
`;

const BTN_EDIT = createButtonHtml(['edit'], 'btn-edit', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` });

/** @todo use print content to show fail (password error, forbidden nickname, mail not a mail ?) */
const BOX_SAVE = `
<div class="flex flex-col justify-start items-start gap-4">
	${createInputHtml(["nickname"], "text", "publicID", { "class": `` })}
	${createInputHtml(["new_password"], "password", "newPassword", { "class": `` })}
	${createInputHtml(["confirm_password"], "password", "confirmPassword", { "class": `` })}
	${createInputHtml(["tfa_mail"], "email", "user-email", { "class": `` })}
	<div id="print-content"></div>
</div>
`;

const BOX_EDIT = `
<div class="flex flex-col gap-4">
	<div>${CURRENT_USER.nickname}</div>
	<div>password: ******</div>
	<div>${CURRENT_USER.twofactor_auth}</div>
	<div>${CURRENT_USER.tfa_mail}</div>
</div>
`;

/** @todo real front with selector to enable / disable 2FA */
/** @todo ask for email only if 2FA is enable */
const SETTINGS_MAIN_STYLE = `
grid grid-rows-1 grid-cols-2 justify-start items-center gap-4 h-full w-full p-4
`;

const SETTINGS_COL_STYLE = `
grow w-full h-full flex flex-col justify-between items-start gap-4
`;

const SETTINGS_USER_INFOS = `
<div class="p-8 flex flex-col">
	${createParagraphHtml(['user_informations'], 'p-uinfo', { 'class': `text-[20px] font-bold` })}
</div>
<div id='btn-switch-edit-save' class='flex flex-col items-end'>
		${BTN_EDIT}
</div>
<div id='switch-edit-save' class='h-[200px] w-full'>
	${BOX_EDIT}
</div>
`;

const SETTINGS_TWOFA_ENABLE = createButtonHtml(['enable_2fa'], 'btn-enable-2fa', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` });
const SETTINGS_TWOFA_DISABLE = createButtonHtml(['disable_2fa'], 'btn-disable-2fa', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` });

const SETTINGS_OPTIONS = `
<div class="p-8 flex flex-col">
	${createParagraphHtml(['options'], 'p-option', { 'class': `text-[20px] font-bold` })}
</div>
<div>
	<div>
		<input type="file" id="change-avatar" accept="image/*">
		<p id='print-avatar-reply'></p>
	</div>
	<div id='switch-2fa'></div>
</div>
`;

const SETTINGS_THEME_SELECTOR = `
<div>
	<div class="p-8 text-[20px] font-bold">themes selector</div>
	<div>${generateThemeButtons()}</div>
</div>
`;

/** @todo add key bind ? */
const SETTINGS = `
<div class="${SETTINGS_MAIN_STYLE}">
	<div class="${SETTINGS_COL_STYLE}">
		<div>
			${SETTINGS_USER_INFOS}
			${SETTINGS_OPTIONS}
		</div>
	</div>
	<div class="${SETTINGS_COL_STYLE}">
		${SETTINGS_THEME_SELECTOR}
	</div>
</div>
`;

function generateThemeButtons(): string {
	const style = `rounded-2xl border-4 border-light bg-primary w-[50px] h-[50px] flex flex-col justify-end items-end gap-[2px]`;

	let selectButtons = `<div class="grid grid-cols-6 grid-rows-2 gap-4 justify-center items-center">`;

	Object.values(Themes).forEach(theme => {
		selectButtons += `<div data-theme="${theme}" id="btn-${theme}" class="${style}">
			<div class="flex-1 m-[5px] w-[10px] h-[10px] rounded-2xl bg-secondary"></div>
			<div class="flex-1 m-[5px] w-[10px] h-[10px] rounded-2xl bg-variant"></div>
			</div>`;
	});
	selectButtons += `</div>`;

	return selectButtons;
}

function generateThemeEvents(): void {
	Object.values(Themes).forEach(theme => {
		const elem = getSafeElement(`btn-${theme}`, HTMLElement);

		elem.addEventListener('click', () => setTheme(theme));
	});
}

function userInformationsBtnEvents(): void {
	const btns = getSafeElement('btn-switch-edit-save', HTMLElement);

	btns.querySelectorAll('*[id]').forEach(elem => {
		switch (elem.id) {
			case 'btn-edit':
				elem.addEventListener('click', editProfile);
				break;
			case 'btn-cancel':
				elem.addEventListener('click', showProfile);
				break;
			case 'btn-save':
				elem.addEventListener('click', updateUser);
				break;
			default:
				break;
		}
	});
}

async function enable2FA(): Promise<void> {
	await sendGetRequestToBack("/api/user/activate-secure");
	update2FAButton();
}

async function disable2FA(): Promise<void> {
	await sendGetRequestToBack("/api/user/desactivate-secure");
	update2FAButton();
}

function update2FAButton(): void {
	const switch2fa = getSafeElement('switch-2fa', HTMLElement);

	/** @todo get 2fa status enable/disable */
	const isEnable = CURRENT_USER.twofactor_auth;

	if (isEnable)
		switch2fa.innerHTML = SETTINGS_TWOFA_DISABLE;
	else
		switch2fa.innerHTML = SETTINGS_TWOFA_ENABLE;

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

function showProfile(): void {
	const elem = getSafeElement('switch-edit-save', HTMLElement);
	const btn = getSafeElement('btn-switch-edit-save', HTMLElement);

	btn.innerHTML = BTN_EDIT;
	elem.innerHTML = BOX_EDIT;

	userInformationsBtnEvents();
}

function editProfile(): void {
	const elem = getSafeElement('switch-edit-save', HTMLElement);
	const btns = getSafeElement('btn-switch-edit-save', HTMLElement);

	elem.innerHTML = BOX_SAVE;
	btns.innerHTML = BTN_SAVE;

	userInformationsBtnEvents();

	const nickname = getSafeElement('publicID', HTMLInputElement);
	const email = getSafeElement("user-email", HTMLInputElement);
	nickname.value = CURRENT_USER.nickname;
	email.value = CURRENT_USER.tfa_mail;
}

function loadSettings(): void {
	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = SETTINGS;
	setActiveBtn('btn-settings');

	const avatar = getSafeElement('change-avatar', HTMLElement);
	avatar.addEventListener('change', (event) => {
		if (event.target instanceof HTMLInputElement) {
			const file = event.target.files?.[0];
			if (file)
				uploadProfilePicture(file);
		}
	});

	const btn = getSafeElement('btn-switch-edit-save', HTMLElement);

	btn.innerHTML = BTN_EDIT;

	userInformationsBtnEvents();
	generateThemeEvents();

	/** @todo fetch information if 2fa activated or not and put the result in innerHTML */
	update2FAButton();
}

async function uploadProfilePicture(file: File): Promise<void> {
	const formData = new FormData();
	formData.append("picture", file);

	const reply = await sendFile(formData);
	printReplyInDiv(reply, "print-avatar-reply");
	if (reply.status === 200)
		updateAvatar();
}

export { SETTINGS, loadSettings, showProfile };
