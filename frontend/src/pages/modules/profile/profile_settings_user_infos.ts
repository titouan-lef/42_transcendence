import { createButtonHtml } from "../../../components/button";
import { createInputHtml } from "../../../components/input";
import { createParagraphHtml } from "../../../components/paragraph";
import { updateUser } from "../../../services/user_management/update_user";
import { getSafeElement } from "../../../utils/getSafeElement";
import { getCurrentUserInfos } from "src/services/user_management/user_state";

const BTN_SAVE = `
<div class='flex flex-row gap-4'>
	${createButtonHtml(['cancel'], 'btn-cancel', { 'class': `bg-dark text-warning p-1 rounded-2xl font-bold` })}
	${createButtonHtml(['save'], 'btn-save', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` })}
</div>
`;

const BTN_EDIT = createButtonHtml(['edit'], 'btn-edit', { 'class': `bg-dark text-secondary p-1 rounded-2xl font-bold` });

/** @todo use print content to show fail (password error, forbidden nickname, mail not a mail ?) */
const BOX_EDITPROFILE = `
<div class="flex flex-col justify-start items-start gap-4">
	${createInputHtml(["nickname"], "text", "publicID", { "class": `` })}
	${createInputHtml(["new_password"], "password", "newPassword", { "class": `` })}
	${createInputHtml(["confirm_password"], "password", "confirmPassword", { "class": `` })}
	${createInputHtml(["tfa_mail"], "email", "user-email", { "class": `` })}
	<div id="print-uinfo-reply"></div>
</div>
`;

const BOX_SHOWPROFILE = `
<div class="flex flex-col gap-4">
	<div id="show-user-nick"></div>
	<div>password: ******</div>
	<div id="show-user-email"></div>
</div>
`;

const SETTINGS_USER_INFOS = `
<div class="p-8 flex flex-col">
	${createParagraphHtml(['user_informations'], 'p-uinfo', { 'class': `text-[20px] font-bold` })}
</div>
<div id='btn-switch-edit-save' class='flex flex-col items-end'>
		${BTN_EDIT}
</div>
<div id='switch-edit-save' class='h-[200px] w-full'>
	${BOX_SHOWPROFILE}
</div>
`;

function userInformationsBtnEvents(): void {
	const btns = getSafeElement('btn-switch-edit-save', HTMLElement);

	btns.querySelectorAll('*[id]').forEach(elem => {
		switch (elem.id) {
			case 'btn-edit':
				elem.addEventListener('click', editUserInfos);
				break;
			case 'btn-cancel':
				elem.addEventListener('click', showUserInfos);
				break;
			case 'btn-save':
				elem.addEventListener('click', updateUser);
				break;
			default:
				break;
		}
	});
}

function editUserInfos(): void {
	const currentUser = getCurrentUserInfos();
	if (!currentUser)
		return;

	const elem = getSafeElement('switch-edit-save', HTMLElement);
	const btn = getSafeElement('btn-switch-edit-save', HTMLElement);

	elem.innerHTML = BOX_EDITPROFILE;
	btn.innerHTML = BTN_SAVE;

	userInformationsBtnEvents();

	const nick = getSafeElement('publicID', HTMLInputElement);
	const email = getSafeElement('user-email', HTMLInputElement);

	nick.value = currentUser.pseudo;
	if (currentUser.email)
		email.value = currentUser.email;
}

function showUserInfos(): void {
	const currentUser = getCurrentUserInfos();
	if (!currentUser)
		return;

	const elem = getSafeElement('switch-edit-save', HTMLElement);
	const btn = getSafeElement('btn-switch-edit-save', HTMLElement);

	btn.innerHTML = BTN_EDIT;
	elem.innerHTML = BOX_SHOWPROFILE;

	userInformationsBtnEvents();

	const nick = getSafeElement('show-user-nick', HTMLElement);
	const email = getSafeElement('show-user-email', HTMLElement);

	nick.innerHTML = currentUser.pseudo;
	email.innerHTML = currentUser.email ? currentUser.email : 'no email set';
}

export { SETTINGS_USER_INFOS, showUserInfos };
