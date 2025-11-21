import { Game } from "./Game.js";
import { GameSettings } from "./settings/GameSettings.js";
import { ObjectMessage, OptionMessage } from "./types_transfert.js";

/**@todo gameManager to handle several games and reconect a user tha has been disconected for a few seconds */
let game: Game | null = null;

/**@todo will see how we pop the game */
async function showCanvas(socket: WebSocket, options: OptionMessage): Promise<void> {
	const settings = new GameSettings(
		options.playerId, options.map, options.wind, options.ball, options.rotatingPlayer, options.spin,
		["KeyA", "KeyD", "KeyW", "KeyS", "Space", "KeyC"],
		["KeyJ", "KeyL", "KeyI", "KeyK", "KeyP", "KeyO"]
	);

	if (game) {
		game.updateOptions(options);
	} else {
		game = await Game.create(socket, settings);
		game.show();
	}
}

async function updateGameObject(object: ObjectMessage): Promise<void> {
	game?.updateObject(object);
} /** @todo change this in the scene manager directly after objects refacto */

async function stopGame(): Promise<void> {
	game?.stop();
	game = null;
}

export { showCanvas, updateGameObject, stopGame };