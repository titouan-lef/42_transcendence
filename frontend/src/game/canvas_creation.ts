import { Game } from "./game.js";
import { GameSettings } from "./gameSettings.js";

//this will change when checking options
/**@todo will move keys to the "session"'s settings */
const SETTINGS: GameSettings = new GameSettings("default", "random", true, true, ["KeyA", "KeyD", "KeyW", "KeyS", "Space"], ["KeyJ", "KeyL", "KeyI", "KeyK", "KeyP"]);

const BUTTON = createButton();
let isPressed = false;

/**@todo not sure about this, do we loose reference at the end ? */
let game: Game;

/**@todo just to test */
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

/**@todo will see how we pop the game */
async function showCanvas(): Promise<void> {
	if (!isPressed) {
		isPressed = true;
		game = await Game.create(SETTINGS);
		game.show();
		/**@todo if the game ends, we have to click 2 times on the button to show it again, which is normal, and will probably change in the future */
	} else {
		isPressed = false;
		game.stop();
	}
}

try {
	BUTTON.addEventListener("click", () => showCanvas());
} catch(e) {
	console.log(e);
}