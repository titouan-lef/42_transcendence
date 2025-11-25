import { Game } from "./Game.js";
import { GameSettings } from "./settings/GameSettings.js";
import { ObjectMessage, OptionMessage } from "./types_transfert.js";

/**@todo gameManager to handle several games and reconect a user tha has been disconected for a few seconds */
let game: Game | null = null;

/**@todo will see how we pop the game */
/**@todo get the player keys from the player settings in DB*/
async function newGame(options: OptionMessage, player1: WebSocket, player2?: WebSocket): Promise<void> {
	let settings;
	if (player2) {
		settings = new GameSettings(
			options.playerId, options.map, options.wind, options.ball, options.rotatingPlayer, options.spin,
			player1, ["KeyA", "KeyD", "KeyJ", "KeyL", "KeyI", "KeyK"],
			player2, ["ArrowLeft", "ArrowRight", "Numpad6", "Numpad4", "Numpad8", "Numpad5"]
		);
	} else {
		settings = new GameSettings(
			options.playerId, options.map, options.wind, options.ball, options.rotatingPlayer, options.spin,
			player1, ["KeyA", "KeyD", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]
		);
	}

	if (game) {
		game.updateOptions(options);
	} else {
		game = await Game.create(settings);
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

export { newGame, updateGameObject, stopGame };
