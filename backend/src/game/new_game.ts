import { Game } from "./Game.js";
import { GameSettings } from "./GameSettings.js";
import { WebSocket } from "ws";

let game: Game;

async function startGame(playerName1: string, playerName2: string, player1: WebSocket, player2: WebSocket): Promise<void> {

	const settings = new GameSettings(
		"default", "random", true, true,
		player1, player2, playerName1, playerName2,
		["KeyA", "KeyD", "KeyW", "KeyS", "Space"],
		["KeyJ", "KeyL", "KeyI", "KeyK", "KeyP"]
	);

	game = await Game.create(settings);
	game.start();
}

async function stopGame(): Promise<void> {
	game.stop;
}

export { startGame, stopGame };