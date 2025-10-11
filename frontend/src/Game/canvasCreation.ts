import { Game } from "./game.js";
import { GameSettings } from "./gameSettings.js";

const SETTINGS: GameSettings = new GameSettings("default", "random", false, false);

const BUTTON = createButton();
const CANVAS = createCanvas();
let game: Game;
let canvasVisibility = false;

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

function showCanvas(): void {
	if (!canvasVisibility){
		CANVAS.style.visibility = "visible";
		canvasVisibility = true;
		if (!game){
			game = new Game(CANVAS, SETTINGS);
		}
		game.start();
	} else {
		if (game){
			game.pause();
		}
		CANVAS.style.visibility = "hidden";
		canvasVisibility = false;
	}
}

try{
	BUTTON.addEventListener("click", () => showCanvas());
} catch(e){
	console.log(e);
}




