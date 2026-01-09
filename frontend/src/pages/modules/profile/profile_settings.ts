import { getSafeElement } from "../../../utils/getSafeElement";
import { createParagraphHtml } from "../../../components/paragraph";
import { setActiveBtn } from "./profile_navbar";
import { SETTINGS_USER_INFOS } from "./profile_settings_user_infos";
import { generateThemeEvents, SETTINGS_THEME_SELECTOR } from "./profile_settings_themes";
import { uploadProfilePicture } from "../../../services/user_management/avatar";
import { generateKeybindsButtons, keybindsNavbarEvents, SETTINGS_KEYBINDS_SELECTOR } from "./profile_settings_keybinds";
import { AI_RANKED_PLAYER_KEYS } from "../../../game/settings/KeySets";
import { isUserConnected } from "../../../services/user_management/user_state";
import { showUserInfos } from "../../../services/user_management/update_user";
import { update2FAButton } from "../../../services/security/2FA";

/** @todo real front with selector to enable / disable 2FA */
/** @todo ask for email only if 2FA is enable */
const SETTINGS_MAIN_STYLE = `
grid grid-rows-1 grid-cols-2 justify-start items-center gap-4 h-full w-full p-4
`;

const SETTINGS_COL_STYLE = `
h-full flex flex-col justify-between items-start gap-4 w-full flex-1 min-w-0 overflow-auto scrollbar-none
`;

const BROWSE_BOX_STYLE = `
flex flex-col w-full
`;

const FILE_INPUT_STYLE = `
w-full text-[12px] text-dark truncate
file:py-1 file:px-4 file:mr-4
file:rounded-xl file:border-0
file:text-[14px] file:font-bold file:font-jbm
file:bg-dark file:text-variant
cursor-pointer
`;

const PRINT_CONTENT_STYLE = `
w-full h-[20px] text-[12px] text-warning text-center
`;

const SETTINGS_AVATAR = `
<div class="flex flex-row w-full items-start">
	<label class="mr-2 font-bold w-[70px]">avatar: </label>
	<input type="file" id="change-avatar" accept="image/*" class="${FILE_INPUT_STYLE}"/>
	<p id='print-avatar-reply' class="${PRINT_CONTENT_STYLE}"></p>
</div>
`;

const SETTINGS_OPTIONS = `
<div class='flex flex-col w-full flex-1 min-h-0 bg-light/10 rounded-2xl p-2'>
	<div class="p-8 flex flex-col">
		${createParagraphHtml(['options'], 'p-option', { 'class': `text-[20px] font-bold` })}
	</div>
	<div>
		<div class='${BROWSE_BOX_STYLE}'>
			${SETTINGS_AVATAR}
		</div>
		<div id='switch-2fa'></div>
	</div>
</div>
`;

const SETTINGS = `
<div class="${SETTINGS_MAIN_STYLE}">
	<dialog id='modal-settings'></dialog>
	<div class="${SETTINGS_COL_STYLE}">
		${SETTINGS_USER_INFOS}
		${SETTINGS_OPTIONS}
	</div>
	<div class="${SETTINGS_COL_STYLE}">
		${SETTINGS_THEME_SELECTOR}
		${SETTINGS_KEYBINDS_SELECTOR}
	</div>
</div>
`;

function loadSettings(): void {
	if (!isUserConnected()) /** @todo maybe not necessary anymore */
		return;

	setActiveBtn('btn-settings');
	const elem = getSafeElement('profile-content', HTMLElement);
	elem.innerHTML = SETTINGS;

	const avatar = getSafeElement('change-avatar', HTMLElement);
	avatar.addEventListener('change', (event) => {
		if (!(event.target instanceof HTMLInputElement))
			return;
		const file = event.target.files?.[0];
		if (!file)
			return;
		uploadProfilePicture(file);
	});

	showUserInfos();
	generateThemeEvents();
	generateKeybindsButtons(AI_RANKED_PLAYER_KEYS); /** @todo le param doit correspondre a celui charger en premier quand tu vas dans settings */
	keybindsNavbarEvents();
	update2FAButton();
}

export { SETTINGS, loadSettings };
