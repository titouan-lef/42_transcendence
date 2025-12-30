import { getSafeElement } from "src/utils/getSafeElement";
import { loadMainBox } from "../box/box_main_utils";

function generateLeaderboard(): string {
	/** @todo fetch leaderboard */

	return `
	`;
}

function leaderboardEvents(): void {
	const allElements = getSafeElement('main-box', HTMLElement).querySelectorAll('*[id]');
	allElements.forEach(elem => {
		switch (elem.id) {
			default:
				break;
		}
	});
}

function loadLeaderboard(): void {
	loadMainBox(generateLeaderboard(), leaderboardEvents);
}

export { loadLeaderboard };
