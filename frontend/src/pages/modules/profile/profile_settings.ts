import { getSafeElement } from "../../../utils/getSafeElement";
import { createParagraphHtml } from "../../../components/paragraph";
import { setActiveBtn } from "./profile_navbar";
import { currentUser, getUserInfos } from "../../../services/user_management/login";
import { SETTINGS_USER_INFOS, showUserInfos } from "./profile_settings_user_infos";
import { generateThemeEvents, SETTINGS_THEME_SELECTOR } from "./profile_settings_themes";
import { update2FAButton } from "./profile_settings_2fa";
import { uploadProfilePicture } from "../../../services/user_management/avatar";
import { generateKeybindsButtons, keybindsNavbarEvents, SETTINGS_KEYBINDS_SELECTOR } from "./profile_settings_keybinds";
import { AI_RANKED_PLAYER_KEYS } from "../../../game/canvas_creation";

/** @todo real front with selector to enable / disable 2FA */
/** @todo ask for email only if 2FA is enable */
const SETTINGS_MAIN_STYLE = `
grid grid-rows-1 grid-cols-2 justify-start items-center gap-4 h-full w-full p-4
`;

const SETTINGS_COL_STYLE = `
grow w-full h-full flex flex-col justify-between items-start gap-4
`;

const SETTINGS_AVATAR = `
<input type="file" id="change-avatar" accept="image/*">
<p id='print-avatar-reply'></p>
`;

const SETTINGS_OPTIONS = `
<div class="p-8 flex flex-col">
	${createParagraphHtml(['options'], 'p-option', { 'class': `text-[20px] font-bold` })}
</div>
<div>
	<div>
		${SETTINGS_AVATAR}
	</div>
	<div id='switch-2fa'></div>
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
		${SETTINGS_KEYBINDS_SELECTOR}
	</div>
</div>
`;

function loadSettings(): void {
	if (!currentUser)
		return;

	const elem = getSafeElement('profile-content', HTMLElement);

	elem.innerHTML = SETTINGS;
	setActiveBtn('btn-settings');

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
