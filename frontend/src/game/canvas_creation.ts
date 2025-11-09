import { GameStatus } from "./data_transfert.js";
import { Game } from "./Game.js";
import { GameSettings } from "./GameSettings.js";

//this will change when checking options
/**@todo will move keys to the "session"'s settings */
const SETTINGS: GameSettings = new GameSettings("default", "random", true, true, ["KeyA", "KeyD", "KeyW", "KeyS", "Space"], ["KeyJ", "KeyL", "KeyI", "KeyK", "KeyP"]);

/**@todo not sure about this, do we loose reference at the end ? */
let game: Game;

/**@todo will see how we pop the game */
async function showCanvas(): Promise<void> {
	game = await Game.create(SETTINGS);
	game.show();
}

async function hideCanvas(): Promise<void> {
	if (game)
		game.stop();
}

async function updateGameStatus(status: GameStatus): Promise<void> {
	/** @todo apply position to the game */
}

export { showCanvas, hideCanvas, updateGameStatus };

/** @todo This part is temporary just to launch the game directly in the front */

let isPressed = false;

function createButton(): HTMLElement {
	const button = document.createElement("button");
	button.textContent = "LaunchGame";
	button.style.position = "Absolute";
	button.style.top = "10%";
	button.style.left = "2%";
	button.style.width = "6%";
	button.style.height = "3%";
	document.body.appendChild(button);

	return button;
}

function test(): void {
	if (!isPressed) {
		isPressed = true;
		showCanvas();
	} else {
		isPressed = false;
		hideCanvas();
	}
}

export { createButton, test };