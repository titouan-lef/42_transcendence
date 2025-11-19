import { Game } from "./Game.js";
import { GameSettings } from "./settings/GameSettings.js";
import { ObjectMessage, OptionMessage, PositionsMessage, TimingMessage } from "./types_transfert.js";

/**@todo not sure about this, do we loose reference at the end ? */
let game: Game;

/**@todo will see how we pop the game */
async function showCanvas(socket: WebSocket, options: OptionMessage): Promise<void> {
	const settings = new GameSettings(
		options.playerId, options.map, options.ball, options.rotatingPlayer, options.spin,
		["KeyA", "KeyD", "KeyW", "KeyS", "Space"],
		["KeyJ", "KeyL", "KeyI", "KeyK", "KeyP"]
	);

	if (game) {
		game.updateOptions(options);
	} else {
		game = await Game.create(socket, settings);
		game.show();
	}
}

async function updateGameObject(object: ObjectMessage): Promise<void> {
	game.updateObject(object);
} /** @todo change this in the scene manager directly after objects refacto */

export { showCanvas, updateGameObject };