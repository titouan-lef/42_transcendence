import { updateAvatar } from "src/services/user_management/avatar";
import { createButtonHtml } from "../../../components/button";
import { applyColor } from "../../../utils/applyColor";
import { getSafeElement } from "../../../utils/getSafeElement";
import { openDialogAddFriend } from "../dialog/dialog_add_friend";
import { openDialogSignIn, openDialogSignUp } from "../dialog/dialog_login";
import { openProfile } from "../profile/profile";
import { clearUserInfos, getCurrentUserInfos } from "src/services/user_management/user_state";
import { loadModularPage } from "src/pages/modular";

const ASIDE_BOX_STYLE = `
grow
flex flex-col items-center gap-[10px] justify-stretch
first:mt-[25px] last:mb-[25px]
`;

const ASIDE_STYLE = `
relative z-20
grow-0
flex
rounded-2xl
w-[200px] p-[5px]
${applyColor('alt')}
`;

const AVATAR_STYLE = `
grow-0
rounded-2xl
bg-white
w-[150px]
h-[150px]
overflow-hidden
`;

const FRIENDLIST_BOX_STYLE = `
grow
flex flex-col items-center gap-[10px] justify-stretch
`;

const FRIENDLIST_STYLE = `
grow
flex flex-col gap-[10px] justify-start items-center
rounded-2xl p-[10px]
w-[150px] h-[50px]
scrollbar-none
overflow-y-scroll overflow-hidden
bg-light
`;

const ASIDE_BTN_STYLE = `
rounded-[10px]
w-[150px] h-[40px]
text-[20px] font-park font-bold
${applyColor()}
`;

const ASIDE_CONNECTED = `
	${createButtonHtml(["profile"], `btn-profile`, { "class": `${ASIDE_BTN_STYLE}` })}
	<div id="friendlist" class="${FRIENDLIST_STYLE}"></div>
	${createButtonHtml(["add_friend"], `btn-friend`, { "class": `${ASIDE_BTN_STYLE}` })}
	${createButtonHtml(["log_out"], `btn-log-out`, { "class": `${ASIDE_BTN_STYLE} ${applyColor('var')}` })}
`;

const ASIDE_NOT_CONNECTED = `
	${createButtonHtml(["sign_in"], `btn-sign-in`, { "class": `${ASIDE_BTN_STYLE}` })}
	${createButtonHtml(["sign_up"], `btn-sign-up`, { "class": `${ASIDE_BTN_STYLE}` })}
`;

const ASIDE_BOX = `
<aside id="aside" class="${ASIDE_STYLE}">
	<div class="${ASIDE_BOX_STYLE}">
		<div class="${AVATAR_STYLE}">
			<img id="avatar-img" src="./images/avatar.png" alt="Avatar">
		</div>
		<div id="aside-status" class="${FRIENDLIST_BOX_STYLE}">
		</div>
	</div>
</aside>
`;

function onDisconnectEvent(): void {
	clearUserInfos();
	loadModularPage();
}

function asideConnectedEvents(): void {
	const allElements = getSafeElement('aside', HTMLElement).querySelectorAll('*[id]');

	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-profile':
				elem.addEventListener('click', openProfile);
				break;
			case 'btn-friend':
				elem.addEventListener('click', openDialogAddFriend);
				break;
			case 'btn-log-out':
				elem.addEventListener('click', onDisconnectEvent);
				break;
			default:
				break;
		}
	});
}

function asideDisconnectedEvents(): void {
	const allElements = getSafeElement('aside', HTMLElement).querySelectorAll('*[id]');

	allElements.forEach(elem => {
		switch (elem.id) {
			case 'btn-sign-in':
				elem.addEventListener('click', openDialogSignIn);
				break;
			case 'btn-sign-up':
				elem.addEventListener('click', openDialogSignUp);
				break;
			default:
				break;
		}
	});
}

function loadAside(): void {
	const aside = getSafeElement('aside-status', HTMLElement);

	if (getCurrentUserInfos()) {
		aside.innerHTML = ASIDE_CONNECTED;
		asideConnectedEvents();
	} else {
		aside.innerHTML = ASIDE_NOT_CONNECTED;
		asideDisconnectedEvents();
	}

	updateAvatar();
}

export { ASIDE_BOX, loadAside };
