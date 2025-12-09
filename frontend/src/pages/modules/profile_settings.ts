import { printReplyInDiv, sendFile, sendGetRequestToBack, sendPostRequestToBack } from "../../services/api_request";
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

const BTN_SAVE = createButtonHtml(['save'], 'btn-save', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` });
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

const SETTINGS_CHANGE_AVATAR = `
<div class="p-8 flex flex-col">
	${createParagraphHtml(['change_avatar'], 'p-avatar', { 'class': `text-[20px] font-bold` })}
</div>
<div>
	<input type="file" id="change-avatar" accept="image/*">
	<p id='print-avatar-reply'></p>
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
			${SETTINGS_CHANGE_AVATAR}
		</div>
	</div>
	<div class="${SETTINGS_COL_STYLE}">
		${SETTINGS_THEME_SELECTOR}
		<div class="w-full flex flex-col items-end">
			${createButtonHtml(['delete_account'], 'btn-delete-account', { 'class': `bg-dark text-warning p-1 rounded-2xl font-bold` })}
		</div>
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

function showProfile(): void {
	const elem = getSafeElement('switch-edit-save', HTMLElement);
	const btn = getSafeElement('btn-switch-edit-save', HTMLElement);

	btn.innerHTML = BTN_EDIT;
	elem.innerHTML = BOX_EDIT;

	btn.removeEventListener('click', updateUser);
	btn.addEventListener('click', editProfile);
}

function editProfile(): void {
	const elem = getSafeElement('switch-edit-save', HTMLElement);
	const btn = getSafeElement('btn-switch-edit-save', HTMLElement);

	btn.innerHTML = BTN_SAVE;
	elem.innerHTML = BOX_SAVE;

	btn.removeEventListener('click', editProfile);
	btn.addEventListener('click', updateUser);

	const nickname = getSafeElement('publicID', HTMLInputElement);
	nickname.value = CURRENT_USER.nickname;
	const email = getSafeElement("user-email", HTMLInputElement);
	email.value = CURRENT_USER.tfa_mail;

	/** @todo add DESACTIVATE 2fa */
	if (!email) {
		// desactivate if no mail entered ?
	} else {
		activate2FA(email.value);
	}
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
	btn.addEventListener('click', editProfile);
	generateThemeEvents();
}

async function uploadProfilePicture(file: File): Promise<void> {
	const formData = new FormData();
	formData.append("picture", file);

	const reply = await sendFile(formData);
	printReplyInDiv(reply, "print-avatar-reply");
	if (reply.status === 200)
		updateAvatar();
}

async function activate2FA(email: string): Promise<void> {
	/** @todo change the email in the update user menu */
	const reply1 = await sendPostRequestToBack("/api/user/email", JSON.stringify({ email: email }));
	printReplyInDiv(reply1, "print-content");

	const reply2 = await sendGetRequestToBack("/api/user/activate-secure");
	printReplyInDiv(reply2, "print-content");
}

export { SETTINGS, loadSettings, showProfile };
