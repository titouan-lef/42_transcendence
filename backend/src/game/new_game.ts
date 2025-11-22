import { Game } from "./Game.js";
import { GameSettings } from "./settings/GameSettings.js";
import { WebSocket } from "ws";

let game: Game;

async function startGame(playerName1: string, player1: WebSocket, playerName2?: string, player2?: WebSocket): Promise<void> {

	const settings = new GameSettings(
		"random", "random", true, true, true,
		player1, playerName1, player2, playerName2
	);

	game = await Game.create(settings);
	game.start();

}

async function stopGame(): Promise<void> {
	game.stop;
}

export { startGame, stopGame };