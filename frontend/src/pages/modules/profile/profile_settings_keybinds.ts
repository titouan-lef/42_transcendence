import { getSafeElement } from "../../../utils/getSafeElement.js";
import { PlayerKeys } from "../../../game/settings/PointSettings.js";
import { AI_RANKED_PLAYER_KEYS, changeKey, LOCAL_PLAYER1_KEYS, LOCAL_PLAYER2_KEYS } from "../../../game/settings/KeySets.js";

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
				${changeName(keyName)} :
				<button id='btn-${keyName}'>${keyCode}</button>
			`;
	}

	generateKeybindsEvents(keys);
}

function changeName(name: string): string {
	switch (name) {
		case "mov_right":
			return "Movement Right";
		case "mov_left":
			return "Movement Left";
		case "rot_right":
			return "Rotate ClockWise";
		case "rot_left":
			return "Rotate CounterClockWise";
		case "normalMode":
			return "Switch to NormalMode";
		case "spinMode":
			return "Switch to SpinMode";
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
