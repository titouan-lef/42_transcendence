import { getSafeElement } from "../../../utils/getSafeElement.js";
import { PlayerKeys } from "../../../game/settings/PointSettings.js";
import { AI_RANKED_PLAYER_KEYS, changeKey, LOCAL_PLAYER1_KEYS, LOCAL_PLAYER2_KEYS } from "../../../game/settings/KeySets.js";

const TABS_CONTAINER_STYLE = `
bg-dark/70 rounded-t-2xl
flex flex-row gap-6 w-full px-4 pt-2
`;

const TAB_BTN = `
flex-1 min-w-0
text-[14px] font-bold tracking-wider uppercase
border-b-2 -mb-[2px]
border-transparent
text-darker
data-[active=true]:border-variant
data-[active=true]:text-variant
`;

/** @todo translation :) */
const SETTINGS_KEYBINDS_SELECTOR = `
<div class='text-[14px] w-full h-full bg-light/10 rounded-2xl'>
	<div class="p-8 pl-10 text-[20px] font-bold">keybinds selector</div>
	<div id='btn-navbar-keybinds' class="${TABS_CONTAINER_STYLE}">
		<button id='btn-ai-ranked-keys' class='${TAB_BTN}' data-active='true'>ai ranked</button>
		<button id='btn-local-player1-keys' class='${TAB_BTN}'>local player 1</button>
		<button id='btn-local-player2-keys' class='${TAB_BTN}'>local player 2</button>
	</div>
	<div id='keybind-buttons' class="grid grid-rows-6 grid-cols-2 border-2 border-b-8 rounded-b-2xl border-dark bg-dark/15 h">
	</div>
</div>
`;

function keybindsNavbarEvents(): void {
	const navbar = getSafeElement('btn-navbar-keybinds', HTMLElement);

	navbar.querySelectorAll('*[id]').forEach(elem => {
		switch (elem.id) {
			case 'btn-local-player1-keys':
				elem.addEventListener('click', () => {
					setActiveTab(elem.id);
					generateKeybindsButtons(LOCAL_PLAYER1_KEYS);
				});
				break;
			case 'btn-local-player2-keys':
				elem.addEventListener('click', () => {
					setActiveTab(elem.id);
					generateKeybindsButtons(LOCAL_PLAYER2_KEYS);
				});
				break;
			case 'btn-ai-ranked-keys':
				elem.addEventListener('click', () => {
					setActiveTab(elem.id);
					generateKeybindsButtons(AI_RANKED_PLAYER_KEYS);
				});
				break;
			default:
				break;
		}
	});
}

function setActiveTab(id: string): void {
	getSafeElement('btn-navbar-keybinds', HTMLElement).querySelectorAll('*[id]').forEach(elem => {
		if (elem.id === id) {
			elem.setAttribute('data-active', 'true');
		} else {
			elem.removeAttribute('data-active');
		}
	});
}

function generateKeybindsButtons(keys: PlayerKeys): void {
	const keybindButtons = getSafeElement('keybind-buttons', HTMLElement);
	keybindButtons.innerHTML = ``;

	for (const [keyName, keyCode] of Object.entries(keys)) {
		keybindButtons.innerHTML += `
			<p id='btn-${keyName}' title='${keyCode ? keyCode : 'no key bind'}' class='align-middle text-left flex-1 m-2 truncate'>
				${changeName(keyName)} : ${keyCode ? keyCode : ''}
			</p>
			`;
	}

	generateKeybindsEvents(keys);
}

function changeName(name: string): string {
	switch (name) {
		case "mov_right":
			return "Move right";
		case "mov_left":
			return "Move left";
		case "rot_right":
			return "Rotate right";
		case "rot_left":
			return "Rotate left";
		case "normalMode":
			return "Switch straight";
		case "spinMode":
			return "Switch spin";
		case "emoteStrong":
			return "Emote Strong";
		case "emoteSad":
			return "Emote Sad";
		case "emoteLol":
			return "Emote Lol";
		case "emoteAngry":
			return "Emote Angry";
		case "dash":
			return "Dash";
		default:
			throw new Error("Error: unknown KeyName.");
	}
}

function generateKeybindsEvents(keys: PlayerKeys): void {
	for (const [keyName, keyCode] of Object.entries(keys)) {
		const elem = getSafeElement(`btn-${keyName}`, HTMLElement);
		elem.addEventListener('click', () => keyboardHandler(keyName, keys));
	}
}

let pendingKeyAction: { action: string; keySet: PlayerKeys } | null = null;

function keyboardHandler(keyName: string, keys: PlayerKeys): void {
	pendingKeyAction = { action: keyName, keySet: keys };
}

/**@todo voir si y a pas une meilleure solution qu'écouter tout le temps sur tout le document' */
document.addEventListener("keydown", (event) => {
	if (!pendingKeyAction)
		return;
	try {
		getSafeElement('keybind-buttons', HTMLElement);

		changeKey(pendingKeyAction.action, event.code, pendingKeyAction.keySet);
		generateKeybindsButtons(pendingKeyAction.keySet);
		pendingKeyAction = null;
	} catch {
		return ;
	}
});

export { SETTINGS_KEYBINDS_SELECTOR, generateKeybindsButtons, keybindsNavbarEvents };
