import { GameStatus } from "./data_transfert.js";
import { Game } from "./Game.js";
import { GameSettings } from "./GameSettings.js";

/**@todo not sure about this, do we loose reference at the end ? */
let game: Game;

/**@todo will see how we pop the game */
async function showCanvas(socket: WebSocket, status: GameStatus): Promise<void> {
	const settings = new GameSettings(
		status.options.map, status.options.ball, status.options.rotatingPlayer, status.options.spin,
		status.player.pseudo, status.enemy.pseudo,
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

async function updateGameStatus(status: GameStatus): Promise<void> {
	/** @todo apply position to the game */
	if (status.player)
		game.updatePlayerPositions(status.player.pseudo, status.player.pos);
	if (status.enemy)
		game.updatePlayerPositions(status.enemy.pseudo, status.enemy.pos);
	if (status.ball)
		game.updateBallPositions(status.ball.pos);
}

export { showCanvas, hideCanvas, updateGameStatus };