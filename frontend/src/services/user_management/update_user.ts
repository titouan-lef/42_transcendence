import { getSafeElement } from "../../utils/getSafeElement.js";
import { isRequestSuccessfull, printReplyInDiv, sendPostRequestToBack } from "../api_request.js";
import { Errors } from '#shared/status_codes';
import { getUserInfos } from "./login.js";
import { loadDialogEmail } from "../../pages/modules/dialog/dialog_2FA.js";
import { BOX_EDITPROFILE, BOX_SHOWPROFILE, BTN_EDIT, BTN_SAVE } from "../../pages/modules/profile/profile_settings_user_infos.js";
import { getCurrentUserInfos } from "./user_state.js";

interface UserInfos {
	nickname: string,
	password: string,
	email: string,
}

async function updateUser(): Promise<void> {
	const nickname = getSafeElement('publicID', HTMLInputElement);
	const pass = getSafeElement('newPassword', HTMLInputElement);
	const confirmPass = getSafeElement('confirmPassword', HTMLInputElement);
	const email = getSafeElement('user-email', HTMLInputElement);
	const container = getSafeElement('print-uinfo-reply', HTMLElement);
	if (!nickname || !pass || !confirmPass || !email || !container)
		return;

	if (pass.value && pass.value !== confirmPass.value) {
		container.innerHTML = `<p>The password and confirm password differs</p>`;
		pass.value = "";
		confirmPass.value = "";
		pass.focus();
		return;
	}
	const data: UserInfos = {
		nickname: nickname.value,
		password: pass.value,
		email: email.value,
	};

	const reply = await sendPostRequestToBack('/api/user/update_user', JSON.stringify(data));
	if (reply.code === Errors.TWOFA_REQUIRED) {
		loadDialogEmail();
		return;
	}
	if (!isRequestSuccessfull(reply)) {
		printReplyInDiv(reply, 'print-uinfo-reply');
		return;
	}

	await getUserInfos();
	showUserInfos();
}

function userInformationsBtnEvents(): void {
	const btns = getSafeElement('btn-switch-edit-save', HTMLElement);
	if (!btns)
		return;

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
	if (elem)
		elem.innerHTML = BOX_EDITPROFILE;
	if (btn)
		btn.innerHTML = BTN_SAVE;

	userInformationsBtnEvents();

	const nickname = getSafeElement('publicID', HTMLInputElement);
	const email = getSafeElement('user-email', HTMLInputElement);

	if (nickname)
		nickname.value = currentUser.nickname;
	if (email && currentUser.email)
		email.value = currentUser.email;
}

function showUserInfos(): void {
	const currentUser = getCurrentUserInfos();
	if (!currentUser)
		return;

	const elem = getSafeElement('switch-edit-save', HTMLElement);
	const btn = getSafeElement('btn-switch-edit-save', HTMLElement);

	if (btn)
		btn.innerHTML = BTN_EDIT;
	if (elem)
		elem.innerHTML = BOX_SHOWPROFILE;

	userInformationsBtnEvents();

	const nickname = getSafeElement('show-user-nickname', HTMLElement);
	const email = getSafeElement('show-user-email', HTMLElement);

	if (nickname)
		nickname.innerHTML = currentUser.nickname;
	if (email)
		email.innerHTML = currentUser.email ? currentUser.email : 'no email set';
}

export { updateUser, showUserInfos };
