import { Game } from "./game.js";
import { GameSettings } from "./gameSettings.js";

//this will change when checking options
/**@todo will move keys to thr "session"'s settings */
const SETTINGS: GameSettings = new GameSettings("random", "random", true, false, ["KeyA", "KeyD", "KeyW", "KeyS"], ["KeyJ", "KeyL", "KeyI", "KeyK"]);

const BUTTON = createButton();
const CANVAS = createCanvas();
let game: Game;
let canvasVisibility = false;

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

/** @todo just to test */
function createCanvas(): HTMLCanvasElement {
	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.style.position = "Absolute";
	canvas.style.top = "10%";
	canvas.style.left = "10%";
	canvas.style.width = "80%";
	canvas.style.height = "80%";
	canvas.style.visibility = "hidden";
	document.body.appendChild(canvas);

	return canvas;
}

/**@todo will see how we pop the game */
async function showCanvas(): Promise<void> {
	if (!canvasVisibility) {
		CANVAS.style.visibility = "visible";
		canvasVisibility = true;
		if (!game) {
			game = await Game.create(CANVAS, SETTINGS);
		}
		game.show();
	} else {
		if (game) {
			game.hide();
		}
		CANVAS.style.visibility = "hidden";
		canvasVisibility = false;
	}
}
try {
	BUTTON.addEventListener("click", () => showCanvas());
} catch(e) {
	console.log(e);
}




