import { Game } from "./Game.js";
import { PointSettings } from "./settings/PointSettings.js";
import { AI_RANKED_PLAYER_KEYS, LOCAL_PLAYER1_KEYS, LOCAL_PLAYER2_KEYS } from "./settings/KeySets.js";
import { OptionMessage } from "#shared/types_transfert.js";

/**@todo gameManager to handle several games and reconect a user tha has been disconected for a few seconds */
let game: Game | null = null;

/**@todo will see how we pop the game */
/**@todo get the player keys from the player settings in DB*/
async function startOrUpdateGame(options: OptionMessage, player1: WebSocket, player2?: WebSocket): Promise<void> {
	let settings;
	if (player2) {
		settings = new PointSettings( /** @todo rename RoundSettings ?? */
			options.playerId, options.map, options.wind, options.ball, options.rotatingPlayer, options.spin, options.dashingPlayer,
			player1,
			LOCAL_PLAYER1_KEYS,
			player2,
			LOCAL_PLAYER2_KEYS
		);
	} else {
		settings = new PointSettings(
			options.playerId, options.map, options.wind, options.ball, options.rotatingPlayer, options.spin, options.dashingPlayer,
			player1,
			AI_RANKED_PLAYER_KEYS
		);
	}

	if (game && !game.isGameFinished()) {
		game.updateOptions(options);
	} else {
		game = await Game.create(settings);
		game.show();
	}
}

export { startOrUpdateGame };
