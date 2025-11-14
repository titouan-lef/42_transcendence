import { Game } from "./Game.js";
import { GameSettings } from "./settings/GameSettings.js";
import { OptionMessage, PositionsMessage } from "./types_transfert.js";

/**@todo not sure about this, do we loose reference at the end ? */
let game: Game;

/**@todo will see how we pop the game */
async function showCanvas(socket: WebSocket, options: OptionMessage): Promise<void> {
	const settings = new GameSettings(
		options.playerId, options.map, options.ball, options.rotatingPlayer, options.spin,
		["KeyA", "KeyD", "KeyW", "KeyS", "Space"],
		["KeyJ", "KeyL", "KeyI", "KeyK", "KeyP"]
	);

	game = await Game.create(socket, settings);
	game.show();
}

async function hideCanvas(): Promise<void> {
	if (game)
		game.stop();
}

async function updateGamePositions(positions: PositionsMessage): Promise<void> {
	/** @todo apply position to the game */
	game.updatePlayerPositions(1, positions.player);
	game.updatePlayerPositions(2, positions.enemy);
	game.updateBallPositions(positions.ball);
}

export { showCanvas, hideCanvas, updateGamePositions };