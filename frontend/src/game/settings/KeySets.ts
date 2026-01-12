import { PlayerKeys } from "./PointSettings";

const LOCAL_PLAYER1_KEYS: PlayerKeys = {
	mov_right: "KeyS",
	mov_left: "KeyW",
	rot_right: "KeyJ",
	rot_left: "KeyL",
	normalMode: "KeyI",
	spinMode: "KeyK",
	emoteStrong: "KeyT",
	emoteSad: undefined,
	emoteLol: undefined,
	emoteAngry: undefined,
	dash: "Space"
};

const LOCAL_PLAYER2_KEYS: PlayerKeys = {
	mov_right: "ArrowUp",
	mov_left: "ArrowDown",
	rot_right: "Numpad4",
	rot_left: "Numpad6",
	normalMode: "Numpad8",
	spinMode: "Numpad5",
	emoteStrong: "Numpad9",
	emoteSad: undefined,
	emoteLol: undefined,
	emoteAngry: undefined,
	dash: "Numpad0"
};

const AI_RANKED_PLAYER_KEYS: PlayerKeys = {
	mov_right: "KeyD",
	mov_left: "KeyA",
	rot_right: "ArrowRight",
	rot_left: "ArrowLeft",
	normalMode: "ArrowUp",
	spinMode: "ArrowDown",
	emoteStrong: "Numpad8",
	emoteSad: "Numpad6",
	emoteLol: "Numpad4",
	emoteAngry: "Numpad2",
	dash: "Space"
};

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
}

export { LOCAL_PLAYER1_KEYS, LOCAL_PLAYER2_KEYS, AI_RANKED_PLAYER_KEYS, changeKey };
