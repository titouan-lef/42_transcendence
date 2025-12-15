import { Game } from "./Game.js";
import { GameSettings, PlayerKeys } from "./settings/GameSettings.js";
import { OptionMessage } from "./types_transfert.js";

/**@todo gameManager to handle several games and reconect a user tha has been disconected for a few seconds */
let game: Game | null = null;
const LOCAL_PLAYER1_KEYS: PlayerKeys = {
	mov_right: "KeyA",
	mov_left: "KeyD",
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
	mov_right: "ArrowLeft",
	mov_left: "ArrowRight",
	rot_right: "Numpad6",
	rot_left: "Numpad4",
	normalMode: "Numpad8",
	spinMode: "Numpad5",
	emoteStrong: "Numpad9",
	emoteSad: undefined,
	emoteLol: undefined,
	emoteAngry: undefined,
	dash: undefined
};

const AI_RANKED_PLAYER_KEYS: PlayerKeys = {
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
	dash: "Space"
};

/**@todo will see how we pop the game */
/**@todo get the player keys from the player settings in DB*/
async function newGame(options: OptionMessage, player1: WebSocket, player2?: WebSocket): Promise<void> {
	let settings;
	if (player2) {
		settings = new GameSettings(
			options.playerId, options.map, options.wind, options.ball, options.rotatingPlayer, options.spin, options.dashingPlayer,
			player1,
			LOCAL_PLAYER1_KEYS,
			player2,
			LOCAL_PLAYER2_KEYS
		);
	} else {
		settings = new GameSettings(
			options.playerId, options.map, options.wind, options.ball, options.rotatingPlayer, options.spin, options.dashingPlayer,
			player1, 
			AI_RANKED_PLAYER_KEYS
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
	game?.closeGame();
	game = null;
}

export { newGame, stopGame, LOCAL_PLAYER1_KEYS, LOCAL_PLAYER2_KEYS, AI_RANKED_PLAYER_KEYS };