import { Game } from "./Game.js";
import { GameSettings } from "./settings/GameSettings.js";

const GAMES = new Map<number, Game>();

function getNewGameId(): number {
	let id = 0;
	while (GAMES.has(id))
		id++;
	return id;
}

async function startGame(id: number, settings: GameSettings): Promise<number> {

	if (id < 0)
		id = getNewGameId();
	const game = await Game.create(id, settings);
	GAMES.set(id, game);
	console.log('New game:', id);
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

export { startGame, stopGame, getNewGameId };
