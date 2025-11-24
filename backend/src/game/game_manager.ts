import { Game } from "./Game.js";
import { GameSettings } from "./settings/GameSettings.js";
import { WebSocket } from "ws";

const GAMES = new Map<number, Game>();

async function startGame(playerName1: string, player1: WebSocket, playerName2?: string, player2?: WebSocket): Promise<number> {

	const settings = new GameSettings(
		"default", "default", true, true, true,
		player1, playerName1, player2, playerName2
	);

	let id = 0;
	while (GAMES.has(id))
		id++;
	
	const game = await Game.create(id, settings);
	GAMES.set(id, game);
	game.start();

	return id;
}
	
async function stopGame(id: number): Promise<void> {
	const game = GAMES.get(id);
	if (!game)
		return;
	game.stop();
	GAMES.delete(id);
}

export { startGame, stopGame };