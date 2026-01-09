import { GameTypes } from "../routes/navigate_types";

let gameType: GameTypes | null = null;

function getGameType(): GameTypes | null {
	return gameType;
}

function setGameType(newType: GameTypes): void {
	gameType = newType;
}

export { getGameType, setGameType };
