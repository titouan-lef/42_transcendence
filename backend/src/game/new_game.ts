import { Game } from "./Game.js";
import { GameSettings } from "./settings/GameSettings.js";
import { WebSocket } from "ws";

let game: Game;

async function startGame(playerName1: string, playerName2: string, player1: WebSocket, player2: WebSocket): Promise<void> {

	const settings = new GameSettings(
		"default", "random", true, true,
		player1, player2, playerName1, playerName2
	);

	game = await Game.create(settings);
	game.start();

	player1.on("message", (message: Buffer) => {
		game.receiveDataFrom(playerName1, message.toString());
	});
	player2.on("message", (message: string) => {
		game.receiveDataFrom(playerName2, message.toString());
	});

}

async function stopGame(): Promise<void> {
	game.stop;
}

export { startGame, stopGame };