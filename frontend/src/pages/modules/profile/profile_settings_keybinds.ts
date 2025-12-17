import { getSafeElement } from "../../../utils/getSafeElement.js";
import { LOCAL_PLAYER1_KEYS, LOCAL_PLAYER2_KEYS, AI_RANKED_PLAYER_KEYS } from "../../../game/canvas_creation.js";
import { PlayerKeys } from "../../../game/settings/GameSettings.js";

/** @todo translation :) */
const SETTINGS_KEYBINDS_SELECTOR = `
<div>
	<div class="p-8 text-[20px] font-bold">Keybinds selector</div>
	<div id='btn-navbar-keybinds' class="flex flex-row gap-4">
		<button id='btn-local-player1-keys'>local player 1</button>
		<button id='btn-local-player2-keys'>local player 2</button>
		<button id='btn-ai-ranked-keys'>ai ranked</button>
	</div>
	<div id='keybind-buttons' class="grid grid-rows-3 grid-cols-4 gap-4">
	</div>
</div>
`;

function keybindsNavbarEvents(): void {
	const navbar = getSafeElement('btn-navbar-keybinds', HTMLElement);

	navbar.querySelectorAll('*[id]').forEach(elem => {
		switch (elem.id) {
			case 'btn-local-player1-keys':
				elem.addEventListener('click', () => generateKeybindsButtons(LOCAL_PLAYER1_KEYS));
				break;
			case 'btn-local-player2-keys':
				elem.addEventListener('click', () => generateKeybindsButtons(LOCAL_PLAYER2_KEYS));
				break;
			case 'btn-ai-ranked-keys':
				elem.addEventListener('click', () => generateKeybindsButtons(AI_RANKED_PLAYER_KEYS));
				break;			
			default:
				break;
		}
	});
}

function generateKeybindsButtons(keys: PlayerKeys): void {
	const keybindButtons = getSafeElement('keybind-buttons', HTMLElement);
	keybindButtons.innerHTML = ``;

	for (const [keyName, keyCode] of Object.entries(keys)) {
		keybindButtons.innerHTML += `
				${keyName} :
				<button id='btn-${keyName}'>${keyCode}</button>
			`;
	}

	generateKeybindsEvents(keys);
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

document.addEventListener("keydown", (event) => {
	if (!pendingKeyAction)
		return;
	try {
		getSafeElement('keybind-buttons', HTMLElement);
		changeKey(pendingKeyAction.action, event.code, pendingKeyAction.keySet);
		pendingKeyAction = null;
	} catch {
		return ;
	}
});

function changeKey(action: string, key: string, keySet: PlayerKeys): void {
	switch (action) {
		case "mov_right":
			keySet.mov_right = key;
			break;
		case "mov_left":
			keySet.mov_left = key;
			break;
		case "rot_right":
			keySet.rot_right = key;
			break;
		case "rot_left":
			keySet.rot_left = key;
			break;
		case "normalMode":
			keySet.normalMode = key;
			break;
		case "spinMode":
			keySet.spinMode = key;
			break;
		case "emoteStrong":
			keySet.emoteStrong = key;
			break;
		case "emoteSad":
			keySet.emoteSad = key;
			break;
		case "emoteLol":
			keySet.emoteLol = key;
			break;
		case "emoteAngry":
			keySet.emoteAngry = key;
			break;
		case "dash":
			keySet.dash = key;
			break;
		default:
			throw new Error("Error: unknown KeyAction.");
	}
	generateKeybindsButtons(keySet);
}

export { SETTINGS_KEYBINDS_SELECTOR, generateKeybindsButtons, keybindsNavbarEvents };


