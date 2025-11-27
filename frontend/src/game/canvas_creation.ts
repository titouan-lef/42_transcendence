import { Game } from "./Game.js";
import { GameSettings } from "./settings/GameSettings.js";
import { OptionMessage } from "./types_transfert.js";

/**@todo gameManager to handle several games and reconect a user tha has been disconected for a few seconds */
let game: Game | null = null;

/**@todo will see how we pop the game */
/**@todo get the player keys from the player settings in DB*/
async function newGame(options: OptionMessage, player1: WebSocket, player2?: WebSocket): Promise<void> {
	let settings;
	if (player2) {
		settings = new GameSettings(
			options.playerId, options.map, options.wind, options.ball, options.rotatingPlayer, options.spin,
			player1,
			{
				mov_right: "KeyA",
				mov_left: "KeyD",
				rot_right: "KeyJ",
				rot_left: "KeyL",
				normalMode: "KeyI",
				spinMode: "KeyK",
				emoteStrong: undefined,
				emoteSad: undefined,
				emoteLol: undefined,
				emoteAngry: undefined,
			},
			player2,
			{
				mov_right: "ArrowLeft",
				mov_left: "ArrowRight",
				rot_right: "Numpad6",
				rot_left: "Numpad4",
				normalMode: "Numpad8",
				spinMode: "Numpad5",
				emoteStrong: undefined,
				emoteSad: undefined,
				emoteLol: undefined,
				emoteAngry: undefined,
			}
		);
	} else {
		settings = new GameSettings(
			options.playerId, options.map, options.wind, options.ball, options.rotatingPlayer, options.spin,
			player1, 
			{
				mov_right: "KeyA",
				mov_left: "KeyD",
				rot_right: "ArrowLeft",
				rot_left: "ArrowRight",
				normalMode: "ArrowUp",
				spinMode: "ArrowDown",
				emoteStrong: "Numpad8",
				emoteSad: "Numpad6",
				emoteLol: "Numpad4",
				emoteAngry: "Numpad2",
			}
		);
	}

	if (game) {
		game.updateOptions(options);
	} else {
		game = await Game.create(settings);
		game.show();
	}
}

async function stopGame(): Promise<void> {
	game?.stop();
	game = null;
}

export { newGame, stopGame };
