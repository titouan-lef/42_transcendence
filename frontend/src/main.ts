import { createButton, test } from "./game/canvas_creation.js";
import { init } from "./routes/page.js";

init();

/** @todo This is temporary just to launch the game in the front */
const BUTTON = createButton();
try {
	BUTTON.addEventListener("click", () => test());
} catch(e) {
	console.log(e);
}
